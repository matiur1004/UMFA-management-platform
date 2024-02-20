import {BaseLineItemViewModel} from "@models";

/** Class helper for positioning of items from separate collections like from the one collection */
export class LineItemsSequenceHandler {
  private previousPosition = 0;
  private newControls = [];

  /** Set position for all new items in merged collections */
  public updatePositions() {
    this.newControls.forEach(c => {
      c.controlPosition = ++this.previousPosition;
    });
    this.newControls = [];
  }

  /** Add separate collection items */
  public MergeCollection(lineItems: BaseLineItemViewModel[]): LineItemsSequenceHandler {
    lineItems.forEach(item => {
      if (!item.controlPosition) {
        this.newControls.push(item);
      } else if (item.controlPosition > this.previousPosition) {
        this.previousPosition = item.controlPosition;
      }
    });
    return this;
  }
}
