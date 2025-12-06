import imgRectangle3 from "figma:asset/6c2bc54b164d85afd1c0449f603d199c57990a3a.png";
import imgRectangle4 from "figma:asset/da1683f7feb4ffd86dcc13f6704e5651b65fb7a8.png";
import { imgRectangle, imgRectangle1, imgRectangle2 } from "./svg-qe46z";

function Group() {
  return (
    <div className="absolute contents inset-[-1.1%_-1.56%_-2.25%_-1.56%]" data-name="Group">
      <div className="[mask-clip:no-clip,_no-clip,_no-clip] [mask-composite:intersect,_intersect,_intersect] [mask-mode:alpha,_alpha,_alpha] [mask-repeat:no-repeat,_no-repeat,_no-repeat] absolute inset-[-1.1%_-1.56%_-2.25%_-1.56%] mask-position-[86.992px,_86.024px,_86.992px_23.401px,_23.401px,_23.401px] mask-size-[5497.063px_2125.5px,_5499px_2126px,_5496.848px_2125.5px]" data-name="Rectangle" style={{ maskImage: `url('${imgRectangle}'), url('${imgRectangle1}'), url('${imgRectangle2}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle3} />
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[-1.1%_-1.56%_-2.25%_-1.56%]" data-name="Group">
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[-1.1%_-1.56%_-2.25%_-1.56%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[-1.1%_-1.56%_-2.25%_-1.56%]" data-name="Group">
      <div className="[mask-clip:no-clip,_no-clip,_no-clip] [mask-composite:intersect,_intersect,_intersect] [mask-mode:alpha,_alpha,_alpha] [mask-repeat:no-repeat,_no-repeat,_no-repeat] absolute inset-[-1.1%_-1.56%_-2.25%_-1.56%] mask-position-[86.992px,_86.024px,_86.992px_23.401px,_23.401px,_23.401px] mask-size-[5497.063px_2125.5px,_5499px_2126px,_5496.848px_2125.5px]" data-name="Rectangle" style={{ maskImage: `url('${imgRectangle}'), url('${imgRectangle1}'), url('${imgRectangle2}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle4} />
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[-1.1%_-1.56%_-2.25%_-1.56%]" data-name="Group">
      <Group3 />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents inset-[-1.1%_-1.56%_-2.25%_-1.56%]" data-name="Mask group">
      <Group2 />
      <Group4 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[-1.1%_-1.56%_-2.25%_-1.56%]" data-name="Group">
      <MaskGroup />
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute bottom-[0.04%] contents left-[0.02%] right-[0.02%] top-0" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute bottom-[0.04%] contents left-[0.02%] right-[0.02%] top-0" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute bottom-[0.01%] contents left-0 right-0 top-0" data-name="Clip path group">
      <Group6 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute bottom-[0.01%] contents left-0 right-0 top-0" data-name="Group">
      <ClipPathGroup1 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute bottom-[0.01%] contents left-0 right-0 top-0" data-name="Group">
      <Group7 />
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className="absolute bottom-[0.04%] contents left-[0.02%] right-[0.02%] top-0" data-name="Clip path group">
      <Group8 />
    </div>
  );
}

export default function Logo() {
  return (
    <div className="relative size-full" data-name="logo 1">
      <ClipPathGroup2 />
    </div>
  );
}