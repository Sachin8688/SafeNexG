import { ArrowRight, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Reveal } from "./reveal";
export function PageHero({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <section className="page-hero"><div className="container"><Reveal><span className="eyebrow eyebrow-dark">{eyebrow}</span><h1>{title}</h1><p>{description}</p></Reveal></div></section>}
export function SectionHeading({eyebrow,title,description,center=false}:{eyebrow:string;title:string;description?:string;center?:boolean}){return <div className={`section-heading ${center?"center":""}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description&&<p>{description}</p>}</div>}
export function CheckList({items}:{items:string[]}){return <ul className="check-list">{items.map(i=><li key={i}><Check aria-hidden="true"/>{i}</li>)}</ul>}
export function CtaBand(){return <section className="cta-band"><div className="container cta-inner"><div><span className="eyebrow eyebrow-dark">Safer operations start here</span><h2>Ready to make your plant safer?</h2><p>Book a live walkthrough tailored to your plant, roles and safety priorities.</p></div><Button asChild variant="light" size="lg"><Link to="/contact">Book a live demo <ArrowRight/></Link></Button></div></section>}
