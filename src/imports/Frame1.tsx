import svgPaths from "./svg-gsfv4q9vrt";

function Info() {
  return (
    <div className="relative shrink-0 size-8" data-name="Info">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Info">
          <path d={svgPaths.p1ab63f00} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full" data-name="Text">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#757575] text-[16px] w-full">
        <p className="leading-[1.4]">
          <span>{`Body text for whatever you’d like to say. Add main takeaway points, quotes, `}</span>
          <span className="text-[#8a226f]">anecdotes, or even a very very short story</span>
          <span>{`. `}</span>Body text for whatever you’d like to say. Add main takeaway points. Body text for whatever you’d like to say. Add main takeaway points
        </p>
      </div>
    </div>
  );
}

function ButtonGroup() {
  return <div className="content-stretch flex gap-4 items-center justify-start shrink-0 w-full" data-name="Button Group" />;
}

function Body() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-40 relative shrink-0" data-name="Body">
      <Text />
      <ButtonGroup />
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-start flex flex-wrap gap-6 items-start justify-start left-[337px] min-w-60 p-[24px] rounded-lg top-[312px] w-[440px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-lg" />
      <Info />
      <Body />
    </div>
  );
}

function Tab() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-3 py-1 relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="Tab">
      <div aria-hidden="true" className="absolute border-[#303030] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#303030] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Main</p>
      </div>
    </div>
  );
}

function Tab1() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-3 py-1 relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="Tab">
      <div aria-hidden="true" className="absolute border-[#b2b2b2] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#767676] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Later</p>
      </div>
    </div>
  );
}

function Tab2() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-3 py-1 relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="Tab">
      <div aria-hidden="true" className="absolute border-[#b2b2b2] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#767676] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Notes</p>
      </div>
    </div>
  );
}

function Tab3() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-3 py-1 relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="Tab">
      <div aria-hidden="true" className="absolute border-[#b2b2b2] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#767676] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Theme</p>
      </div>
    </div>
  );
}

function Tab4() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-3 py-1 relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="Tab">
      <div aria-hidden="true" className="absolute border-[#b2b2b2] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#767676] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Settings</p>
      </div>
    </div>
  );
}

function Tab5() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-3 py-1 relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="Tab">
      <div aria-hidden="true" className="absolute border-[#b2b2b2] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#767676] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Board</p>
      </div>
    </div>
  );
}

function Tabs() {
  return (
    <div className="absolute content-stretch flex items-start justify-start left-[228px] overflow-clip top-3.5" data-name="Tabs">
      <Tab />
      <Tab1 />
      <Tab2 />
      <Tab3 />
      <Tab4 />
      <Tab5 />
    </div>
  );
}

function Info1() {
  return (
    <div className="relative shrink-0 size-8" data-name="Info">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Info">
          <path d={svgPaths.p1ab63f00} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full" data-name="Text">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#757575] text-[16px] w-full">
        <p className="leading-[1.4]">{`Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. `}</p>
      </div>
    </div>
  );
}

function Body1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-40 relative shrink-0" data-name="Body">
      <Text1 />
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-start flex flex-wrap gap-6 items-start justify-start left-[337px] min-w-60 p-[24px] rounded-lg top-[575px] w-[440px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-lg" />
      <Info1 />
      <Body1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[337px] top-[575px]">
      <Card1 />
    </div>
  );
}

function Info2() {
  return (
    <div className="relative shrink-0 size-8" data-name="Info">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Info">
          <path d={svgPaths.p1ab63f00} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full" data-name="Text">
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">
        <p className="leading-[1.2]">Title</p>
      </div>
    </div>
  );
}

function Body2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-40 relative shrink-0" data-name="Body">
      <Text2 />
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-start flex flex-wrap gap-6 items-start justify-start left-[337px] min-w-60 p-[24px] rounded-lg top-[205px] w-[440px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-lg" />
      <Info2 />
      <Body2 />
    </div>
  );
}

function MenuHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="Menu Header">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start leading-[0] not-italic pb-1 pt-2 px-4 relative w-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#757575] text-[14px] w-full">
            <p className="leading-[1.4]">Heading</p>
          </div>
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#1e1e1e] text-[16px] w-full">
            <p className="leading-[1.4]">Heading</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuSeparator() {
  return (
    <div className="relative shrink-0 w-full" data-name="Menu Separator">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-4 py-2 relative w-full">
          <div className="bg-[#d9d9d9] h-px shrink-0 w-full" data-name="Rule" />
        </div>
      </div>
    </div>
  );
}

function Star1() {
  return (
    <div className="relative shrink-0 size-5" data-name="Star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Star"></g>
      </svg>
    </div>
  );
}

function MenuShortcut() {
  return (
    <div className="content-stretch flex items-center justify-end relative rounded-lg shrink-0" data-name="Menu Shortcut">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap">
        <p className="leading-none whitespace-pre">⇧A</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Row">
      <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">
        <p className="leading-[1.4]">Menu Label</p>
      </div>
      <MenuShortcut />
    </div>
  );
}

function Body3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="Body">
      <Row />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#757575] text-[14px] w-full">
        <p className="leading-[1.4]">Menu description.</p>
      </div>
    </div>
  );
}

function MenuItem() {
  return (
    <div className="box-border content-stretch flex gap-3 items-start justify-start overflow-clip px-4 py-3 relative rounded-lg shrink-0 w-[285px]" data-name="Menu Item">
      <Star1 />
      <Body3 />
    </div>
  );
}

function Star2() {
  return (
    <div className="relative shrink-0 size-5" data-name="Star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Star">
          <path d={svgPaths.p388c8d00} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function MenuShortcut1() {
  return (
    <div className="content-stretch flex items-center justify-end relative rounded-lg shrink-0" data-name="Menu Shortcut">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap">
        <p className="leading-none whitespace-pre">⇧A</p>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Row">
      <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">
        <p className="leading-[1.4]">Menu Label</p>
      </div>
      <MenuShortcut1 />
    </div>
  );
}

function Body4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="Body">
      <Row1 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#757575] text-[14px] w-full">
        <p className="leading-[1.4]">Menu description.</p>
      </div>
    </div>
  );
}

function MenuItem1() {
  return (
    <div className="relative rounded-lg shrink-0 w-full" data-name="Menu Item">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start px-4 py-3 relative w-full">
          <Star2 />
          <Body4 />
        </div>
      </div>
    </div>
  );
}

function MenuSection() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative rounded-lg shrink-0 w-full" data-name="Menu Section">
      <MenuItem />
      {[...Array(2).keys()].map((_, i) => (
        <MenuItem1 key={i} />
      ))}
    </div>
  );
}

function MenuSeparator1() {
  return (
    <div className="relative rounded-lg shrink-0 w-full" data-name="Menu Separator">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-4 py-2 relative w-full">
          <div className="bg-[#d9d9d9] h-px shrink-0 w-full" data-name="Rule" />
        </div>
      </div>
    </div>
  );
}

function Star4() {
  return (
    <div className="relative shrink-0 size-5" data-name="Star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Star">
          <path d={svgPaths.p388c8d00} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function MenuShortcut3() {
  return (
    <div className="content-stretch flex items-center justify-end relative rounded-lg shrink-0" data-name="Menu Shortcut">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap">
        <p className="leading-none whitespace-pre">⇧A</p>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Row">
      <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">
        <p className="leading-[1.4]">Menu Label</p>
      </div>
      <MenuShortcut3 />
    </div>
  );
}

function Body6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="Body">
      <Row3 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#757575] text-[14px] w-full">
        <p className="leading-[1.4]">Menu description.</p>
      </div>
    </div>
  );
}

function MenuItem3() {
  return (
    <div className="relative rounded-lg shrink-0 w-full" data-name="Menu Item">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start px-4 py-3 relative w-full">
          <Star4 />
          <Body6 />
        </div>
      </div>
    </div>
  );
}

function Star5() {
  return (
    <div className="relative shrink-0 size-5" data-name="Star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Star">
          <path d={svgPaths.p388c8d00} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function MenuShortcut4() {
  return (
    <div className="content-stretch flex items-center justify-end relative rounded-lg shrink-0" data-name="Menu Shortcut">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap">
        <p className="leading-none whitespace-pre">⇧A</p>
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Row">
      <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">
        <p className="leading-[1.4]">Menu Label</p>
      </div>
      <MenuShortcut4 />
    </div>
  );
}

function Body7() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="Body">
      <Row4 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#757575] text-[14px] w-full">
        <p className="leading-[1.4]">Menu description.</p>
      </div>
    </div>
  );
}

function MenuItem4() {
  return (
    <div className="box-border content-stretch flex gap-3 items-start justify-start overflow-clip px-4 py-3 relative rounded-lg shrink-0 w-[285px]" data-name="Menu Item">
      <Star5 />
      <Body7 />
    </div>
  );
}

function MenuSection1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Menu Section">
      <MenuItem3 />
      <MenuItem4 />
    </div>
  );
}

function Menu() {
  return (
    <div className="absolute bg-[#ffffff] left-[51px] rounded-lg top-[205px] w-[230px]" data-name="Menu">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[8px] relative w-[230px]">
        <MenuHeader />
        <MenuSeparator />
        <MenuSection />
        <MenuSeparator1 />
        <MenuSection1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-lg shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]" />
    </div>
  );
}

function X() {
  return (
    <div className="relative shrink-0 size-4" data-name="X">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="X">
          <path d="M12 4L4 12M4 4L12 12" id="Icon" stroke="var(--stroke-0, #F5F5F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Tag() {
  return (
    <div className="absolute bg-[#2c2c2c] box-border content-stretch flex gap-2 items-center justify-center left-[796px] p-[8px] rounded-lg top-[311px]" data-name="Tag">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap">
        <p className="leading-none whitespace-pre">Tag</p>
      </div>
      <X />
    </div>
  );
}

function X1() {
  return (
    <div className="relative shrink-0 size-4" data-name="X">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="X">
          <path d="M12 4L4 12M4 4L12 12" id="Icon" stroke="var(--stroke-0, #F5F5F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Tag1() {
  return (
    <div className="absolute bg-[#2c2c2c] box-border content-stretch flex gap-2 items-center justify-center left-[789px] p-[8px] rounded-lg top-[582px]" data-name="Tag">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap">
        <p className="leading-none whitespace-pre">Tag</p>
      </div>
      <X1 />
    </div>
  );
}

function ArrowRightCircle() {
  return (
    <div className="absolute left-[94px] size-12 top-[103px]" data-name="Arrow right-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Arrow right-circle">
          <path d={svgPaths.p1ee58600} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function Book() {
  return (
    <div className="absolute h-[35px] left-[202px] top-[227px] w-[39px]" data-name="Book">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 35">
        <g id="Book">
          <path d={svgPaths.p39f059f0} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function Bookmark() {
  return (
    <div className="absolute left-[106px] size-6 top-[294px]" data-name="Bookmark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Bookmark">
          <path d={svgPaths.p325a7800} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function PlusCircle() {
  return (
    <div className="absolute left-[543px] size-12 top-[715px]" data-name="Plus circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Arrow right-circle">
          <path d={svgPaths.p1ee58600} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-[#d9d9d9] h-[749px] left-0 top-0 w-[882px]">
        <div aria-hidden="true" className="absolute border border-[#000000] border-solid inset-0 pointer-events-none" />
      </div>
      <Card />
      <div className="absolute left-[19px] size-[11px] top-6">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #F70E0E)" id="Ellipse 1" r="5.5" />
        </svg>
      </div>
      <div className="absolute left-[19px] size-[11px] top-6">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #F70E0E)" id="Ellipse 1" r="5.5" />
        </svg>
      </div>
      <div className="absolute left-[19px] size-[11px] top-6">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #F70E0E)" id="Ellipse 1" r="5.5" />
        </svg>
      </div>
      <div className="absolute left-[19px] size-[11px] top-6">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #F70E0E)" id="Ellipse 1" r="5.5" />
        </svg>
      </div>
      <div className="absolute left-[19px] size-[11px] top-6">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #F70E0E)" id="Ellipse 1" r="5.5" />
        </svg>
      </div>
      <div className="absolute left-10 size-[11px] top-6">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #F7F70E)" id="Ellipse 6" opacity="0.7" r="5.5" />
        </svg>
      </div>
      <div className="absolute left-[59px] size-[11px] top-6">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #087C2B)" id="Ellipse 7" r="5.5" />
        </svg>
      </div>
      <Tabs />
      <Group1 />
      <div className="absolute flex h-[235.976px] items-center justify-center left-[775px] top-[312px] w-[2px]">
        <div className="flex-none rotate-[89.514deg]">
          <div className="h-0 relative w-[236.008px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 236 5">
                <line id="Line 1" stroke="var(--stroke-0, #D42098)" strokeWidth="5" x2="236.008" y1="2.5" y2="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Card2 />
      <Menu />
      <Tag />
      <Tag1 />
      <ArrowRightCircle />
      <div className="absolute font-['Inter:Semi_Bold',_sans-serif] font-semibold h-[38px] leading-[0] left-[226px] not-italic text-[#000000] text-[24px] top-[113px] tracking-[-0.48px] w-[762px]">
        <p className="leading-[1.2]">What to focus on right now: a massive hit.</p>
      </div>
      <Book />
      <Bookmark />
      <PlusCircle />
    </div>
  );
}