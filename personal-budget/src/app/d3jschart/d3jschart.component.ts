import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-d3jschart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './d3jschart.component.html',
  styleUrls: ['./d3jschart.component.scss']
})
export class D3jschartComponent implements AfterViewInit {

  //#region Properties

  private svg: any;
  private width = 600;
  private height = 325;
  private radius = Math.min(this.width, this.height) / 2;
  private colors: any;

  private d3pieData: any = {
    titles: [],
    values: [],
  };

  //#endregion

  constructor(private data: DataService) {}

  ngAfterViewInit(): void {

    if (this.data.chartData == null)
    {
      var obs = this.data.loadData().subscribe((res:any) => {
        this.renderChart();
      });
    }
    else
    {
      this.renderChart();
    }

  }

  private renderChart()
  {
    var chartData = this.data.chartData;
      for (var i = 0; i < chartData.myBudget.length; i++) {
            this.d3pieData.titles[i] = chartData.myBudget[i].title;
            this.d3pieData.values[i] = chartData.myBudget[i].budget;
          }
    const data = this.getModeledData();
    this.createSvg();
    this.setColorScheme(data);
    this.drawChart(data);
  }

  private getModeledData(): any {
    var mappings = [];
    for (var i = 0; i < this.d3pieData.titles.length; i++) {
      mappings[i] = {
        label: this.d3pieData.titles[i],
        value: this.d3pieData.values[i],
      };
    }
    return mappings;
  }

  private key(d: any): string {
    return d.data.label;
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private setColorScheme(data: any): void {
    this.colors = d3
      .scaleOrdinal()
      .domain(data.map((d: any) => d.label.toString()))
      .range(d3.schemeCategory10);
  }

  private drawChart(data: any) {
    var arc = d3
      .arc()
      .outerRadius(this.radius * 0.7)
      .innerRadius(this.radius * 0.4);

    var outerArc = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    this.svg.append('g')
            .attr('class', 'slices');

    this.svg.append('g')
            .attr('class', 'labels');

    this.svg.append('g')
            .attr('class', 'lines');

    const pie = d3.pie<any>().value((d: any) => Number(d.value));
    this.svg
      .select('.slices')
      .selectAll('path.slice')
      .data(pie(data))
      .enter()
      .insert('path')
      .style('fill', (d: any, i: any) => this.colors(i))
      .attr('class', 'slice')
      .attr('d', arc)
      .exit()
      .remove();

    var radius = this.radius;
    function midAngle(d: any) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    this.svg
      .select('.labels')
      .selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .text((d: any) => d.data.label)
      .attr('transform', (d: any) => 'translate(' + outerArc.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 12)
      .transition()
      .attrTween('transform', function (d: any, i: any, n: any) {
        const currentElement = d3.select(n[i]) as typeof d;
        currentElement._current = currentElement._current || d;
        var interpolate = d3.interpolate(currentElement._current, d);
        currentElement._current = interpolate(0);
        return function (t: any) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
        };
      })
      .styleTween('text-anchor', function (d: any, i: any, n: any) {
        const currentElement = d3.select(n[i]) as typeof d;
        currentElement._current = currentElement._current || d;
        var interpolate = d3.interpolate(currentElement._current, d);
        currentElement._current = interpolate(0);
        return function (t: any) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? 'start' : 'end';
        };
      });

    this.svg
      .select('.lines')
      .selectAll('polyline')
      .data(pie(data), this.key)
      .enter()
      .append('polyline')
      .transition()
      .attrTween('points', function (d: any, i: any, n: any) {
        const currentElement = d3.select(n[i]) as typeof d;
        currentElement._current = currentElement._current || d;
        var interpolate = d3.interpolate(currentElement._current, d);
        currentElement._current = interpolate(0);
        return function (t: any) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });
  }
}
