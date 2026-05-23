import Reveal from "@/components/effects/Reveal";

const universities = [
  { name: "Harvard", abbr: "H" },
  { name: "MIT", abbr: "M" },
  { name: "Stanford", abbr: "S" },
  { name: "Yale", abbr: "Y" },
  { name: "Princeton", abbr: "P" },
  { name: "Caltech", abbr: "C" },
  { name: "Oxford", abbr: "O" },
  { name: "Cambridge", abbr: "C" },
];

export default function TrustedBy() {
  return (
    <section className="bg-[#F5F5F5] py-24 border-y border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <Reveal>
          <p className="text-center text-sm font-medium text-[#737373] mb-12 tracking-wide">
            Trusted by students at leading institutions worldwide
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8">
            {universities.map((u) => (
              <div key={u.name} className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-[#E5E5E5] hover:border-[#DC2626]/20 hover:shadow-lg transition-all duration-300 cursor-default">
                <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-sm font-bold text-[#525252]">{u.abbr}</div>
                <span className="text-sm font-semibold text-[#525252]">{u.name}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
