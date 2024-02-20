import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {
  DEFAULT_AVERAGE_COLOR,
  IDataChart,
  LineType
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {usagesText} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {StringExtension} from '@shared-helpers';

@Directive({
  selector: '[customLine]'
})
export class CustomLineDirective implements AfterViewInit {
  @Input('customLine') lineType: LineType;
  @Input() customColors: IDataChart[];
  @Input() results: Array<{ name: string; value: number }>;
  private readonly svgNS = 'http://www.w3.org/2000/svg';

  constructor(private elRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.drawGradient(this.customColors, this.lineType);
  }

  isAverageColor(colorName: string): boolean {
    const [_, avgUsg] = usagesText;

    return colorName === avgUsg;
  }

  drawGradient(customColors: IDataChart[], lineType: LineType) {
    let index = 0;
    const paths = this.elRef.nativeElement.getElementsByClassName(
      'line-series'
    );


    for (let path of paths) {
      const id = StringExtension.NewGuid();

      const pathAttributes = {
        'stroke-width': 2,
        stroke: DEFAULT_AVERAGE_COLOR,
        'marker-start': `url(#dot${id})`,
        'marker-mid': `url(#dot${id})`,
        'marker-end': `url(#dot${id})`
      };

      const isComboChartLine = this.lineType === LineType.Combo_Chart;

      if (customColors && customColors.length) {
        if (!this.isAverageColor(customColors[index].name) && !isComboChartLine) {
          let nextColor = null;
          switch (lineType) {
            case LineType.Single:
              nextColor = customColors[index + 1];
              break;
            case LineType.Multiple:
              nextColor = customColors[index + 2];
              break;
            case LineType.Multiple_Average:
              nextColor = customColors[index + 3];
              break;
            default:
              nextColor = customColors[index + 2];
              break;
          }

          const linearGradient = this.createLinearGradient(customColors[index].value, nextColor ? nextColor.value : customColors[index].value);
          const gradientId = linearGradient.getAttribute('id');
          const defs = path.previousSibling.previousSibling;
          defs.appendChild(linearGradient);
          pathAttributes['stroke'] = `url(#${gradientId})`;
        }

        const pathElement = path.getElementsByTagName('path')[0];
        const circleColor = isComboChartLine ? DEFAULT_AVERAGE_COLOR : customColors[index].value;
        this.createMarker(path, circleColor, id);
        this.setAttributes(pathElement, pathAttributes);
        index += 1;
      }
    }
  }

  /**
   * create marker
   *
   */

  createMarker(path, color, id) {
    const marker = document.createElementNS(
      this.svgNS,
      'marker'
    );
    const circle = document.createElementNS(
      this.svgNS,
      'circle'
    );
    path.previousSibling.previousSibling.append(marker);
    marker.append(circle);
    const m = path.previousSibling.previousSibling.getElementsByTagName('marker')[0];
    const c = path.previousSibling.previousSibling.getElementsByTagName('circle')[0];

    const markerAttributes = {
      id: `dot${id}`,
      viewBox: '0 0 10 10',
      refX: 5,
      refY: 5,
      markerWidth: 8,
      markerHeight: 8
    };

    const circleAttributes = {
      cx: 5,
      cy: 5,
      'stroke-width': 2,
      'stroke': color,
      r: 3,
      fill: '#fff'
    };

    m.append(circle);

    this.setAttributes(m, markerAttributes);
    this.setAttributes(c, circleAttributes);
  }

  /**
   * set multiple attributes
   */
  setAttributes(element, attributes) {
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
  }

  private createLinearGradient(color: string, nextColor: string) {
    const gradient = document.createElementNS(
      this.svgNS,
      'linearGradient'
    );
    gradient.id = StringExtension.NewGuid();

    const stops = [
      {
        'color': color,
        'offset': '30%'
      }, {
        'color': nextColor,
        'offset': '100%'
      }
    ];
    for (let i = 0, length = stops.length; i < length; i++) {
      const stop = document.createElementNS(this.svgNS, 'stop');
      stop.setAttribute('offset', stops[i].offset);
      stop.setAttribute('stop-color', stops[i].color);

      // Add the stop to the <lineargradient> element.
      gradient.appendChild(stop);
    }

    return gradient;
  }
}
