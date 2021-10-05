// Figma Widget API version 1, update 1

declare global {
  // Extend the global widget api
  interface PluginAPI {
    widget: WidgetAPI;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Widget

  interface WidgetAPI {
    register(component: FunctionalWidget<any>): void;
    h(...args: any[]): void;

    // Hooks
    useWidgetId(): string;
    useSyncedState<T>(
      name: string,
      defaultValue: T
    ): [T, (newValue: T) => void];
    useSyncedMap<T>(name: string): SyncedMap<T>;
    usePropertyMenu(
      items: WidgetPropertyMenuItem[],
      onChange: (event: WidgetPropertyEvent) => void | Promise<void>
    ): void;

    useEffect(effect: () => (() => void) | void): void;

    waitForTask(promise: Promise<any>): void;

    // Components
    AutoLayout: AutoLayout;
    Frame: Frame;
    Image: ImageComponent;
    Rectangle: Rectangle;
    Ellipse: Ellipse;
    Text: TextComponent;
    SVG: SVG;
  }

  type SyncedMap<T> = {
    readonly length: number;

    get(key: string): T | undefined;
    set(key: string, value: T): void;
    delete(key: string): void;
    keys(): string[];
    values(): T[];
    entries(): [string, T][];
  };

  type AutoLayout = FunctionalWidget<AutoLayoutProps>;
  type Frame = FunctionalWidget<FrameProps>;

  type Rectangle = FunctionalWidget<RectangleProps>;

  type ImageComponent = FunctionalWidget<ImageProps>;

  type Ellipse = FunctionalWidget<EllipseProps>;

  type TextComponent = FunctionalWidget<TextProps>;

  type SVG = FunctionalWidget<SVGProps>;

  type FigmaDeclarativeNode = Object | any[] | string | null;
  type FunctionalWidget<T> = (props: T) => FigmaDeclarativeNode;

  type WidgetPropertyMenuItem = {
    tooltip: string;
    propertyName: string;
    itemType: "action";
    icon?: string;
  };

  type WidgetPropertyMenu = WidgetPropertyMenuItem[];
  type WidgetPropertyEvent = { propertyName: string };

  interface TextProps extends BaseProps, WidgetJSX.TextProps {
    font?: { family: string; style: string };
    children?: string | string[];
  }

  interface FrameProps
    extends BaseProps,
      WidgetJSX.FrameProps,
      HasChildrenProps {}

  interface AutoLayoutProps
    extends BaseProps,
      WidgetJSX.AutoLayoutProps,
      HasChildrenProps {}

  interface EllipseProps extends BaseProps, WidgetJSX.EllipseProps {}

  interface RectangleProps extends BaseProps, WidgetJSX.RectangleProps {}

  interface ImageProps extends BaseProps, WidgetJSX.ImageProps {}

  interface SVGProps extends BaseProps, Partial<WidgetJSX.FrameProps> {
    src: string;
  }

  interface BaseProps extends WidgetJSX.BaseProps {
    // We have a custom onClick api that returns a promise
    onClick?: () => Promise<any> | void;
    key?: string | number;
  }

  interface HasChildrenProps {
    children?: FigmaDeclarativeNode | FigmaDeclarativeNode[];
  }

  namespace WidgetJSX {
    export type HexCode = string;

    export interface Vector {
      x: number;
      y: number;
    }

    export interface Color {
      r: number;
      g: number;
      b: number;
      a: number;
    }

    export type AlignItems = "center" | "start" | "end";
    export type BlendMode =
      | "normal"
      | "multiply"
      | "screen"
      | "overlay"
      | "darken"
      | "lighten"
      | "color-dodge"
      | "color-burn"
      | "hard-light"
      | "soft-light"
      | "difference"
      | "exclusion"
      | "hue"
      | "saturation"
      | "color"
      | "luminosity";

    export type PaintType =
      | "image"
      | "solid"
      | "gradient-linear"
      | "gradient-radial"
      | "gradient-angular"
      | "gradient-diamond";

    export interface PaintProps {
      type: PaintType;
      blendMode?: BlendMode;
      visible?: boolean;
      opacity?: number;
    }

    export interface SolidPaint extends PaintProps {
      type: "solid";
      color: Color | HexCode;
    }

    export interface ColorStop {
      position: number;
      color: Color;
    }

    export interface GradientPaint extends PaintProps {
      type:
        | "gradient-linear"
        | "gradient-radial"
        | "gradient-angular"
        | "gradient-diamond";
      gradientHandlePositions: [Vector, Vector, Vector];
      gradientStops: ColorStop[];
    }

    export type Transform = [
      [number, number, number],
      [number, number, number]
    ];

    export interface ImagePaint extends PaintProps {
      type: "image";
      src: string;
      imageSize?: { width: number; height: number };
      scaleMode?: ScaleMode;
      imageTransform?: Transform;
      scalingFactor?: number;
      rotation?: number;
      imageRef: string;
    }

    export type Paint = SolidPaint | GradientPaint | ImagePaint;

    export interface ShadowEffect {
      type: "inner-shadow" | "drop-shadow";
      color: HexCode | Color;
      offset: Vector;
      blur: number;
      blendMode?: BlendMode;
      spread?: number;
      visible?: boolean;
    }

    export interface BlurEffect {
      type: "layer-blur" | "background-blur";
      blur: number;
      visible?: boolean;
    }

    export type Effect = ShadowEffect | BlurEffect;

    export type Size = number | "fill-parent";
    export type AutolayoutSize = Size | "hug-contents";
    export type StrokeAlign = "inside" | "outside" | "center";
    export type ScaleMode = "fill" | "fit" | "tile" | "crop";
    export type Overflow = "visible" | "hidden" | "scroll";

    export interface TopConstraint {
      type: "top";
      offset: number;
    }

    export interface BottomConstraint {
      type: "bottom";
      offset: number;
    }

    export interface TopBottomConstraint {
      type: "top-bottom";
      topOffset: number;
      bottomOffset: number;
    }

    export interface LeftConstraint {
      type: "left";
      offset: number;
    }

    export interface RightConstraint {
      type: "right";
      offset: number;
    }

    export interface LeftRightConstraint {
      type: "left-right";
      leftOffset: number;
      rightOffset: number;
    }

    export interface CenterConstraint {
      type: "center";
      offset: number;
    }

    export interface HorizontalScaleConstraint {
      type: "horizontal-scale";
      leftOffsetPercent: number;
      rightOffsetPercent: number;
    }

    export interface VerticalScaleConstraint {
      type: "vertical-scale";
      topOffsetPercent: number;
      bottomOffsetPercent: number;
    }

    type VerticalConstraint =
      | TopConstraint
      | BottomConstraint
      | TopBottomConstraint
      | CenterConstraint
      | VerticalScaleConstraint;
    type HorizontalConstraint =
      | LeftConstraint
      | RightConstraint
      | LeftRightConstraint
      | CenterConstraint
      | HorizontalScaleConstraint;

    export type CornerRadius =
      | number
      | {
          topLeft?: number;
          topRight?: number;
          bottomLeft?: number;
          bottomRight?: number;
        };

    export type Path = {
      path: string;
      windingRule: "evenodd" | "nonzero";
    };

    export type FullPadding = {
      top?: number;
      left?: number;
      bottom?: number;
      right?: number;
    };
    export type VerticalHorizontalPadding = {
      vertical?: number;
      horizontal?: number;
    };
    export type Padding = number | FullPadding | VerticalHorizontalPadding;

    export type FontWeightNumerical =
      | 100
      | 200
      | 300
      | 400
      | 500
      | 600
      | 700
      | 800
      | 900;
    export type FontWeightString =
      | "thin"
      | "extra-light"
      | "light"
      | "normal"
      | "medium"
      | "semi-bold"
      | "bold"
      | "extra-bold"
      | "black";
    export type FontWeight = FontWeightNumerical | FontWeightString;

    ///
    /// MIXINS
    ///
    export interface BaseProps extends BlendProps, ConstraintProps {
      name?: string;
      hidden?: boolean;
    }

    export interface GeometryProps {
      fill?: HexCode | Color | Paint | Paint[];
      stroke?: HexCode | Color | SolidPaint | SolidPaint[];
      strokeWidth?: number;
      strokeAlign?: StrokeAlign;
    }

    export interface PathProps {
      fillPath?: Path[];
      strokePath?: Path[];
    }

    export interface SizeProps {
      width?: Size;
      height?: Size;
    }

    export interface AutoLayoutSizeProps {
      width?: AutolayoutSize;
      height?: AutolayoutSize;
    }

    export interface CornerProps {
      cornerRadius?: CornerRadius;
    }

    export interface BlendProps {
      blendMode?: BlendMode;
      opacity?: number;
      effect?: Effect | Effect[];
    }

    export interface TransformProps {
      rotation?: number;
      flipVertical?: boolean;
    }

    export interface ConstraintProps {
      x?: number; // | HorizontalConstraint
      y?: number; // | VerticalConstraint
    }

    export interface LayoutProps {
      spacing?: number | "auto";
      padding?: Padding;
      direction?: "horizontal" | "vertical";
      horizontalAlignItems?: AlignItems;
      verticalAlignItems?: AlignItems;
    }

    export interface TextStyleProps {
      fontFamily?: string;
      letterSpacing?: number;
      textDecoration?: "none" | "strikethrough" | "underline";
      fontSize?: number;
      italic?: boolean;
      textCase?:
        | "upper"
        | "lower"
        | "title"
        | "original"
        | "small-caps"
        | "small-caps-forced";
      fontWeight?: FontWeight;
      fontPostScriptName?: string;
      href?: string;
      fill?: HexCode | Color | SolidPaint | SolidPaint[];
    }

    ///
    /// COMPONENTS
    ///

    export interface FrameProps
      extends BaseProps,
        GeometryProps,
        Required<SizeProps>,
        TransformProps,
        CornerProps {
      overflow?: Overflow;
    }

    export interface AutoLayoutProps
      extends Omit<FrameProps, "width" | "height">,
        LayoutProps,
        AutoLayoutSizeProps {}

    export interface EllipseProps
      extends BaseProps,
        GeometryProps,
        TransformProps,
        SizeProps {}

    export interface ImageProps
      extends Omit<RectangleProps, "fill" | "width" | "height">,
        SizeProps {
      src: string | ImagePaint;
    }

    export interface LineProps extends BaseProps, TransformProps {
      stroke?: HexCode | Color | SolidPaint | SolidPaint[];
      strokeWidth?: number;
      length: number | "fill-parent";
      direction?: "horizontal" | "vertical";
    }

    export interface RectangleProps
      extends BaseProps,
        GeometryProps,
        Required<SizeProps>,
        TransformProps,
        CornerProps {}

    export interface SVGProps
      extends BaseProps,
        GeometryProps,
        SizeProps,
        TransformProps,
        PathProps {}

    export interface ParagraphProps {
      spacing: number;
    }

    export interface SpanProps extends TextStyleProps {}

    export interface TextProps
      extends BaseProps,
        AutoLayoutSizeProps,
        TransformProps,
        TextStyleProps {
      paragraphIndent?: number;
      paragraphSpacing?: number;
      horizontalAlignText?: "left" | "right" | "center" | "justified";
      verticalAlignText?: "top" | "center" | "bottom";
      lineHeight?: number | string | "auto";
    }

    export type ComponentProps = AutoLayoutProps | FrameProps;
  }
} // declare global

export {};