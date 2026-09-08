import { motion, useScroll, useTransform } from 'motion/react';
import React, { useRef } from 'react';
import { cn } from '../lib/utils';

const projects = [
  {
    id: "01",
    name: "EcoSense India",
    desc: "A full-stack environmental intelligence platform aggregating real-time weather, AQI, and satellite data from 7+ government and commercial APIs.",
    tech: ["React", "Node.js", "MongoDB", "Redis", "Leaflet"],
    year: "2024",
    category: "Full-Stack Web",
    link: "#"
  },
  {
    id: "02",
    name: "IR-AIS",
    desc: "AI-powered road safety platform classifying accident severity using Random Forest and XGBoost with SMOTE-balanced training data.",
    tech: ["Python", "XGBoost", "Next.js", "TypeScript"],
    year: "2024",
    category: "AI / Machine Learning",
    link: "https://github.com/Nitinshakthi7/IR-AIS-India-Road-Accident-Intelligence-System"
  },
  {
    id: "03",
    name: "GameVault",
    desc: "Full-stack game library management system with JWT authentication, RESTful API endpoints, and MongoDB-backed storage.",
    tech: ["Express", "MongoDB", "JWT", "REST API"],
    year: "2024",
    category: "Backend Architecture",
    link: "https://github.com/Nitinshakthi7/GameVault"
  },
  {
    id: "04",
    name: "Looped Lies",
    desc: "Solo-developed 15–20 hour narrative action-adventure game in Unreal Engine 5 featuring an original story and time loop mechanic.",
    tech: ["Unreal Engine 5", "C++", "Blueprints", "Nanite"],
    year: "2024",
    category: "Game Development",
    link: "#"
  }
];

function ProjectCard({ project, index }: { project: typeof projects[0], index: number, key?: React.Key }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col gap-8 md:gap-16 w-full items-center",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Image container */}
      <div className="w-full md:w-3/5 overflow-hidden rounded-lg bg-dark/5 aspect-[4/3] md:aspect-[16/10] relative group block cursor-none" data-cursor="VIEW">
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />
        
        {/* Placeholder for project image with parallax inner */}
        <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] relative bg-dark/10">
          <div className="absolute inset-0 flex items-center justify-center font-display text-4xl text-light/10 uppercase font-bold tracking-widest">
            {project.name}
          </div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>
        
        {/* Hover scale effect container */}
        <div className="absolute inset-0 bg-dark mix-blend-overlay opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />
      </div>

      {/* Text container */}
      <div className="w-full md:w-2/5 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-sans text-[9px] tracking-[0.3em] font-bold text-light/40 font-bold">{project.id}</span>
          <div className="h-[1px] flex-grow bg-dark/10" />
          <span className="font-sans text-[9px] tracking-[0.3em] font-bold text-light/40 uppercase">{project.category}</span>
        </div>
        
        <h3 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-light mb-6 leading-none">
          {project.name}
        </h3>
        
        <p className="font-sans text-base text-light/70 mb-8 leading-relaxed text-balance">
          {project.desc}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map(t => (
            <span key={t} className="px-3 py-1 rounded-full border border-light/10 font-sans text-xs uppercase tracking-wider text-light/60">
              {t}
            </span>
          ))}
        </div>
        
        <a 
          href={project.link}
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-widest text-light w-fit"
          data-cursor="CLICK"
        >
          <span className="relative overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full">Explore Project</span>
            <span className="block absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Explore Project</span>
          </span>
          <span className="w-8 h-[1px] bg-dark transition-all duration-300 group-hover:w-12 group-hover:bg-accent" />
        </a>
      </div>
    </motion.div>
  );
}

export function Work() {
  return (
    <section id="work" className="relative w-full py-32 px-6 md:px-12 bg-[#0F0F0F] text-light z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-32">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-12"
        >
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-light">
            SELECTED <span className="text-light/30">WORK</span>
          </h2>
          <p className="mt-6 font-sans text-sm tracking-widest text-light/50 max-w-md uppercase">
            A showcase of systems, platforms, and digital experiences.
          </p>
        </motion.div>

        <div className="flex flex-col gap-32 md:gap-48">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
