const brands = [
  "Harvard", "Stanford", "MIT", "Oxford", "Yale", "Cambridge",
  "Imperial", "ETH Zurich", "Princeton", "Caltech", "Columbia", "Chicago",
];

function BrandRow() {
  return (
    <>
      {brands.map((name) => (
        <span
          key={name}
          className="inline-block mx-8 sm:mx-12 text-[#A3A3A3] hover:text-[#525252] transition-colors duration-300 whitespace-nowrap"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </span>
      ))}
    </>
  );
}

export default function TrustedBy() {
  return (
    <section className="bg-[#F5F5F5] py-16 border-y border-[#E5E5E5] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 mb-8">
        <p className="text-center text-sm font-medium text-[#737373] tracking-wide">
          Trusted by students at leading institutions worldwide
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap items-center">
          <BrandRow />
          <BrandRow />
          <BrandRow />
        </div>
      </div>
    </section>
  );
}
