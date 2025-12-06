import imgRectangle1 from "figma:asset/6303e8dcc4b52dc83bedb7876578abe30165231a.png";
import { imgGroup, imgRectangle } from "./svg-5hgy7";

function Group() {
  return (
    <div className="absolute bottom-[0.01%] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[1548.67px_2047.56px] right-[0.02%] top-[0.01%]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1549 2048">
        <g id="Group">
          <path d="M0 0H1548.67V2047.56H0V0Z" fill="var(--fill-0, white)" id="Vector" />
          <path d="M0 0H1548.67V2047.56H0V0Z" fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute bottom-[0.01%] contents left-0 right-[0.02%] top-[0.01%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute bottom-[0.03%] contents left-0 right-[0.02%] top-[0.04%]" data-name="Group">
      <div className="absolute bottom-[0.03%] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0.56px] mask-size-[1548.67px_2046px] right-[0.02%] top-[0.04%]" data-name="Rectangle" style={{ maskImage: `url('${imgRectangle}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgRectangle1} />
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute bottom-[0.03%] contents left-0 right-[0.02%] top-[0.04%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute bottom-[0.03%] contents left-0 right-[0.02%] top-[0.07%]" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

export default function UntitledDesign() {
  return (
    <div className="relative size-full" data-name="Untitled design 1">
      <ClipPathGroup />
      <ClipPathGroup1 />
    </div>
  );
}