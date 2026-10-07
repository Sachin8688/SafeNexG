import { motion, useReducedMotion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
export function Reveal({children, delay=0, className="", ...props}: ComponentPropsWithoutRef<typeof motion.div> & {delay?:number}) {
 const reduce=useReducedMotion();
 if (reduce) return <motion.div className={className} {...props}>{children}</motion.div>;
 return <motion.div className={className} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.16}} transition={{duration:.55,delay,ease:[.2,.8,.2,1]}} {...props}>{children}</motion.div>
}
