export interface OrderItem {
  orderItemId: number;
  orderItemSequenceNo: number; // Order Item Sequence No
  orderUnitPrice: number; // Order Unit Price
  amount: number; // Amount
  itemDiscountPercentage: number; // Item Discount %
  currencyCode: string; // CURRENCY.Kod (FK)
  proposalItemId: number; // PROPOSAL ITEM.Id (FK)
  productCode: string; // PRODUCT.Kod (FK)
  orderNo: number; // ORDER.No (FK)
  unitCode: string; // UNIT.Code (FK)
}
