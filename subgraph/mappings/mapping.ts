import { BigInt } from "@graphprotocol/graph-ts";
import {
  ProductRegistered,
  ProductTransferred,
  ProductVerified,
  ProductFrozen,
  ProductUnfrozen
} from "../generated/SimpleSupplyChain/SimpleSupplyChain";
import { Product, Transfer, Verification, FreezeEvent } from "../generated/schema";

export function handleProductRegistered(event: ProductRegistered): void {
  let entity = new Product(event.params.id.toString());
  entity.name = event.params.name;
  entity.currentOwner = event.params.owner;
  entity.verified = false;
  entity.frozen = false;
  entity.registeredAt = event.block.timestamp;
  entity.save();
}

export function handleProductTransferred(event: ProductTransferred): void {
  let id = event.params.id.toString();
  let product = Product.load(id);
  if (product == null) return;
  product.currentOwner = event.params.to;
  product.save();

  let transfer = new Transfer(
    id + "-" + event.transaction.hash.toHex()
  );
  transfer.product = id;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.timestamp = event.block.timestamp;
  transfer.save();
}

export function handleProductVerified(event: ProductVerified): void {
  let id = event.params.id.toString();
  let product = Product.load(id);
  if (product == null) return;
  product.verified = true;
  product.save();

  let v = new Verification(
    id + "-" + event.transaction.hash.toHex()
  );
  v.product = id;
  v.timestamp = event.block.timestamp;
  v.save();
}

export function handleProductFrozen(event: ProductFrozen): void {
  let id = event.params.id.toString();
  let product = Product.load(id);
  if (product == null) return;
  product.frozen = true;
  product.save();

  let f = new FreezeEvent(
    id + "-frozen-" + event.transaction.hash.toHex()
  );
  f.product = id;
  f.isFrozen = true;
  f.timestamp = event.block.timestamp;
  f.save();
}

export function handleProductUnfrozen(event: ProductUnfrozen): void {
  let id = event.params.id.toString();
  let product = Product.load(id);
  if (product == null) return;
  product.frozen = false;
  product.save();

  let f = new FreezeEvent(
    id + "-unfrozen-" + event.transaction.hash.toHex()
  );
  f.product = id;
  f.isFrozen = false;
  f.timestamp = event.block.timestamp;
  f.save();
}