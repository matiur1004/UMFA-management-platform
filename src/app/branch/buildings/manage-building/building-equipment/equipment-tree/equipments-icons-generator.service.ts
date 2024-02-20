import {Injectable} from '@angular/core';
import {EquipmentTreeModel, EquipmentTypes} from '@models';

@Injectable()
export class EquipmentsIconsGenerator {
  private widthOfIcon = 220;
  private heightOfIcon = 250;
  private verticalShift = 45;
  private styleLine = 'stroke="black" stroke-width="4"';

  constructor() {
  }

  generate(value: EquipmentTreeModel): string {
    let res = '';
    res =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${this.widthOfIcon}" height="${this.heightOfIcon}">` +
      this.renderBaseShape(value) +
      this.renderAttributes(value) +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(res);
  }

  renderBaseShape(equipment: EquipmentTreeModel) {
    const radiusOfCircle = 30;
    let warningBg = '#F5F6FA';
    if (equipment.isDummy) {
      warningBg = '#fffa56';
    } else if (equipment.isFaulty) {
      warningBg = '#ff3030';
    }

    const style = `stroke="black" fill="${warningBg}" stroke-width="4"`;
    let bgColor = '#F5F6FA';
    //let bgColor = '#ffb6b6';
    if (equipment.highlight) {
      bgColor = '#fff8de';
    }

    const bgPlace = `<rect x="0" y="0" width="${this.widthOfIcon}" height="${this.heightOfIcon}" fill="${bgColor}" />`;
    const verticalLine = `<line x1="${this.widthOfIcon / 2}" y1="0" x2="${this
      .widthOfIcon / 2}"  y2="${this.heightOfIcon}" ${style}/>`;

    const leftSpiral = `<g stroke-width="4" fill="none" stroke="black"><path d="M 166.8 145 H 113.6 C 105 145.4 98.1 152.6 98.2 161.2 c 0 0.6 0 1.1 0.1 1.7 c 0.9 6.3 5.7 12.2 12.2 13.2 c 5.2 0.8 11.3 -2.4 11.4 -8.1 c 0.1 -6.4 -6.1 -9.4 -11.7 -8 c -6.3 1.6 -11 6.7 -12.2 13.1 c -1.1 6.3 1.8 12.5 7.2 15.8 c 4.6 2.7 12.7 3.3 15.7 -2.1 c 2.7 -4.9 0 -10.3 -5.1 -11.9 c -5.5 -1.6 -11.4 0.2 -15.1 4.5 c -3.6 4.5 -3.4 11.5 -1.3 16.7 c 2.1 5.2 7.1 9.3 12.9 9 H 166"/></g>`;
    const rightSpiral = `<g stroke-width="4" fill="none" stroke="black"><path d="M 52 204 c 0 0.6 0.5 1 1 1 h 54.5 c 5.8 0 10.8 -4.1 12.9 -9.3 c 2.1 -5.2 2.3 -12.2 -1.3 -16.7 c -3.7 -4.3 -9.6 -6.1 -15.1 -4.5 c -5.1 1.6 -7.8 7 -5.1 11.9 c 3 5.4 11.1 4.8 15.7 2.1 c 5.4 -3.3 8.3 -9.5 7.2 -15.8 c -1.2 -6.4 -5.9 -11.5 -12.2 -13.1 c -5.6 -1.4 -11.8 1.6 -11.7 8 c 0.1 5.7 6.2 8.9 11.4 8.1 c 6.5 -1 11.3 -6.9 12.2 -13.2 c 0.1 -0.6 0.1 -1.1 0.1 -1.7 c 0.1 -8.6 -6.8 -15.8 -15.4 -15.9 H 53 "/></g>`;

    let res = '';
    let amperate = this.getAmperage(equipment.attributes);

    switch (equipment.attributes['type']) {
      case EquipmentTypes.Breaker: {
        res = bgPlace + verticalLine;
        if (amperate) {
          res +=
            `<line x1="${this.widthOfIcon / 2 - radiusOfCircle}" y1="${this
              .heightOfIcon /
            2 -
            radiusOfCircle}" x2="${this.widthOfIcon / 2 +
            radiusOfCircle}" y2="${this.heightOfIcon / 2 +
            radiusOfCircle}" ${style}/>` +
            `<line x1="${this.widthOfIcon / 2 - radiusOfCircle}" y1="${this
              .heightOfIcon /
            2 +
            radiusOfCircle}" x2="${this.widthOfIcon / 2 +
            radiusOfCircle}" y2="${this.heightOfIcon / 2 -
            radiusOfCircle}" ${style}/>`;
        }
        break;
      }

      case EquipmentTypes.WholeCurrentMeter: {
        res =
          bgPlace +
          verticalLine +
          `<circle cx="${this.widthOfIcon / 2}" cy="${this.heightOfIcon -
          radiusOfCircle -
          this.verticalShift}" r="${radiusOfCircle}" ${style} />` +
          //Serial number
          `<foreignObject x="${this.widthOfIcon / 2 - radiusOfCircle}" y="${this
            .heightOfIcon -
          radiusOfCircle -
          this.verticalShift -
          8}" width="${radiusOfCircle * 2}" height="30">` +
          '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:14px; text-align: center;font-family: Arial;">' +
          this.getSerialNumber(equipment) +
          '</div>' +
          '</foreignObject>';
        break;
      }

      case EquipmentTypes.HighVoltageMeter:
      case EquipmentTypes.CTMeter:
        res =
          bgPlace +
          verticalLine +
          `<circle cx="${this.widthOfIcon / 2 +
          radiusOfCircle * 2 -
          4}" cy="${this.heightOfIcon -
          radiusOfCircle -
          this.verticalShift}" r="${radiusOfCircle}" ${style}/>` +
          leftSpiral +
          //Serial number
          `<foreignObject x="${this.widthOfIcon / 2 +
          radiusOfCircle -
          4}" y="${this.heightOfIcon -
          radiusOfCircle -
          this.verticalShift -
          8}" width="${radiusOfCircle * 2}" height="30">` +
          '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:14px; text-align: center;font-family: Arial;">' +
          this.getSerialNumber(equipment) +
          '</div>' +
          '</foreignObject>';
        break;
    }

    return res;
  }

  getSerialNumber(equipment) {
    return equipment.isDummy
      ? '?'
      : (equipment.serialNumber && equipment.serialNumber.substr(-4)) + '-E';
  }

  getAmperage(attr: any): string {
    let res = '';
    if (attr.breakerInfo && attr.breakerInfo.attributes.amperage) {
      res = attr.breakerInfo.attributes.amperage;
    } else if (attr.amperage) {
      res = attr.amperage;
    }
    if (res === 'A' || res === '0A') {
      res = '';
    }
    return res;
  }

  renderAttributes(equipment: EquipmentTreeModel) {
    let res = '';
    res += this.renderBreaker(equipment);
    res += this.renderAmperage(equipment);
    res += this.renderPhase(equipment);
    res += this.renderCtRatio(equipment);

    return res;
  }

  renderCtRatio(equipment) {
    const radiusOfCircle = 30;
    const {attributes} = equipment;

    let res = '';
    res += `<text dominant-baseline="bottom" text-anchor="end" x="0" y="${this
      .heightOfIcon /
    2 +
    radiusOfCircle +
    radiusOfCircle / 2 +
    this
      .verticalShift}" transform="rotate(270 10,${this
      .heightOfIcon /
    2 +
    radiusOfCircle})">${attributes.ctRatio ? attributes.ctRatio : ''}</text>`;

    return res;
  }

  renderBreaker(equipment) {
    let res = '';
    const amperage = this.getAmperage(equipment.attributes);
    if (equipment.attributes.breakerInfo && amperage) {
      res +=
        `<line x1="${this.widthOfIcon / 2 - 15}" y1="50" x2="${this
          .widthOfIcon /
        2 +
        15}" y2="80" ${this.styleLine}/>` +
        `<line x1="${this.widthOfIcon / 2 - 15}" y1="80" x2="${this
          .widthOfIcon /
        2 +
        15}" y2="50" ${this.styleLine}/>`;
    }
    return res;
  }

  renderAmperage(equipment) {
    let res = '';
    const amperage = this.getAmperage(equipment.attributes);
    if (
      equipment.attributes.breakerInfo &&
      equipment.attributes.breakerInfo.attributes.amperage
    ) {
      res +=
        `<foreignObject x="${this.widthOfIcon / 2 +
        18}" y="55" width="90" height="30">` +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px; text-align: left;font-family: Arial;">' +
        (amperage ? amperage : '') +
        '</div>' +
        '</foreignObject>';
    } else if (equipment.attributes.amperage) {
      res +=
        `<foreignObject x="${this.widthOfIcon / 2 + 22}" y="${this
          .heightOfIcon /
        2 -
        12}" width="90" height="30">` +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px; text-align: left;font-family: Arial;">' +
        (amperage ? amperage : '') +
        '</div>' +
        '</foreignObject>';
    }
    return res;
  }

  renderPhase(equipment) {
    let res = '';
    let phase = 0;
    if (
      equipment.attributes.breakerInfo &&
      equipment.attributes.breakerInfo.attributes.phase
    ) {
      phase = equipment.attributes.breakerInfo.attributes.phase;
    } else if (equipment.attributes && equipment.attributes.phase) {
      phase = equipment.attributes.phase;
    }
    for (let i = 0; i < phase; i++) {
      res += `<line x1="${this.widthOfIcon / 2 - 15}" y1="${25 +
      i * 7}" x2="${this.widthOfIcon / 2 + 15}" y2="${5 + i * 7}" ${
        this.styleLine
      }/>`;
    }
    return res;
  }
}
