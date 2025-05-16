import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type wsMsg = {
  for: {
    name: string;
    id: number;
  };
  from: { name: string; id: number };
};
export interface Selection {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/anchorNode) */
  readonly anchorNode: Node | null;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/anchorOffset) */
  readonly anchorOffset: number;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/direction) */
  readonly direction: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/focusNode) */
  readonly focusNode: Node | null;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/focusOffset) */
  readonly focusOffset: number;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/isCollapsed) */
  readonly isCollapsed: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/rangeCount) */
  readonly rangeCount: number;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/type) */
  readonly type: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/addRange) */
  addRange(range: Range): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/collapse) */
  collapse(node: Node | null, offset?: number): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/collapseToEnd) */
  collapseToEnd(): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/collapseToStart) */
  collapseToStart(): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/containsNode) */
  containsNode(node: Node, allowPartialContainment?: boolean): boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/deleteFromDocument) */
  deleteFromDocument(): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/empty) */
  empty(): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/extend) */
  extend(node: Node, offset?: number): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/getRangeAt) */
  getRangeAt(index: number): Range;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/modify) */
  modify(alter?: string, direction?: string, granularity?: string): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/removeAllRanges) */
  removeAllRanges(): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/removeRange) */
  removeRange(range: Range): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/selectAllChildren) */
  selectAllChildren(node: Node): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/setBaseAndExtent) */
  setBaseAndExtent(
    anchorNode: Node,
    anchorOffset: number,
    focusNode: Node,
    focusOffset: number,
  ): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Selection/setPosition) */
  setPosition(node: Node | null, offset?: number): void;
  toString(): string;
}
