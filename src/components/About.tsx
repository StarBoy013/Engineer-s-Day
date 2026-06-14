import React from "react";

export const About: React.FC = () => {
  return (
    <section className="py-24 px-margin-edge" id="about">
      <div className="max-w-max-width mx-auto">
        <div className="border border-primary p-0 relative bg-surface">
          {/* Section Header Tab */}
          <div className="bg-primary px-4 py-1 text-on-primary font-label-caps text-[10px] tracking-widest uppercase inline-block">
            Ref. Manual Section 1.0
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 border-t border-primary">
            {/* Left Column */}
            <div className="md:col-span-4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-primary bg-surface-container-low flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-[10px] text-secondary tracking-widest uppercase block mb-4">
                  Annotation 01
                </span>
                <h2 className="font-headline-lg text-headline-lg uppercase tracking-tight leading-none text-primary">
                  Why Engineers Day Matters
                </h2>
              </div>
              <div className="mt-8 border-t border-primary/20 pt-4">
                <span className="font-technical-numeral text-4xl opacity-10 font-light text-primary">
                  01.01
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-8 p-8 md:p-12 space-y-8 flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <span className="font-technical-numeral text-xl text-secondary font-bold mt-1">
                    A.
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed font-serif">
                    Beyond the steel and silicon lies a human story of persistent inquiry and radical imagination. National Engineers Day is not merely a celebration of infrastructure, but an acknowledgment of the structural integrity of our society itself.
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="font-technical-numeral text-xl text-secondary font-bold mt-1">
                    B.
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed font-serif">
                    From the microscopic circuits that power our connectivity to the sprawling bridges that unite our cities, engineering is the craft of making the impossible tangible. We invite you to join us as we deconstruct the present and assemble a more resilient future.
                  </p>
                </div>
              </div>

              {/* Subsection footer */}
              <div className="pt-6 border-t border-primary/10 flex justify-between items-center">
                <div className="w-32 h-1 bg-secondary"></div>
                <span className="font-label-caps text-[10px] text-outline tracking-widest uppercase select-none">
                  END OF SUBSECTION
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
