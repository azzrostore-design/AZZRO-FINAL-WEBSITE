"use client";
import { useState, useRef, useEffect } from "react";
import ProductPickerModal from "./ProductPickerModal";
import { type StoreProduct } from "@/lib/useStoreProducts";

/* SAFE JSON PARSER */
function safeParseJSON(text: string) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : cleaned);
  } catch {
    return null;
  }
}

const STYLISTS = [
  {id:"eli",name:"Eli",style:"Minimal · Timeless",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face"},
  {id:"zara",name:"Zara",style:"Bold · Contemporary",avatar:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"},
  {id:"mia",name:"Mia",style:"Boho · Earthy",avatar:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face"},
  {id:"riya",name:"Riya",style:"Ethnic · Fusion",avatar:"https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=80&h=80&fit=crop&crop=face"},
];

const OCCASIONS=["Date Night","Office Wear","Coffee Hangout","Wedding Guest","Beach Day","Party","Festival","Casual Errands","Gym / Active","Travel"];
const STYLE_VIBES=["Minimal","Bold","Elegant","Casual","Boho","Street","Ethnic","Luxe"];

interface OutfitItem {
  name:string;
  items:string[];
  vibe:string;
  color:string;
  emoji:string;
  tip:string;
  imageUrl?:string;
  products?:StoreProduct[];
}

/* fal.ai image generation */
async function generateOutfitImage(outfitName:string,items:string[],vibe:string){
  try{
    const prompt=`Fashion editorial photo, ${vibe} style outfit: ${items.join(", ")}. Professional model, white background, high quality fashion photography, Indian fashion aesthetic`;

    const res=await fetch("/api/generate-image",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt,width:768,height:1024})
    });

    if(!res.ok) return null;

    const data=await res.json();
    return data.image?.url||data.images?.[0]?.url||null;

  }catch{
    return null;
  }
}

export default function AIOutfitMaker({onClose}:{onClose?:()=>void}){

const [stylist,setStylist]=useState(STYLISTS[0]);
const [showPicker,setShowPicker]=useState(false);
const [occasion,setOccasion]=useState("");
const [showDrop,setShowDrop]=useState(false);
const [styleVibe,setStyleVibe]=useState("");
const [prompt,setPrompt]=useState("");
const [loading,setLoading]=useState(false);
const [outfits,setOutfits]=useState<OutfitItem[]>([]);
const [containerW,setContainerW]=useState(400);

const [showProductPicker,setShowProductPicker]=useState(false);
const [activeOutfitIdx,setActiveOutfitIdx]=useState<number|null>(null);

const containerRef=useRef<HTMLDivElement>(null);

useEffect(()=>{
const m=()=>{if(containerRef.current)setContainerW(containerRef.current.offsetWidth);}
m()
const ro=new ResizeObserver(m)
if(containerRef.current) ro.observe(containerRef.current)
return ()=>ro.disconnect()
},[])

const wide=containerW>=680

/* MAIN AI OUTFIT GENERATION */

const makeOutfits=async()=>{

if(!occasion) return

setLoading(true)
setOutfits([])

try{

const res=await fetch("/api/ai",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
max_tokens:1000,
messages:[
{
role:"user",
content:`You are ${stylist.name} (${stylist.style}). Generate 3 outfit suggestions.
Occasion: ${occasion}.
Vibe: ${styleVibe||"any"}.
Notes: ${prompt||"none"}.

Respond ONLY JSON:

{"outfits":[
{"name":"Name","items":["item1","item2","item3"],"vibe":"tag","color":"#hex","emoji":"👗","tip":"short tip"}
]}`
}
]
})
})

if(!res.ok) throw new Error("AI API failed")

const data=await res.json()

const parsed=safeParseJSON(data.text||"")

let outfitsData:OutfitItem[]=parsed?.outfits||[]

if(!outfitsData.length){

outfitsData=[
{
name:"Casual Chic",
items:["White blouse","Blue jeans","Sneakers"],
vibe:"Minimal",
color:"#D4B896",
emoji:"✨",
tip:"Add a small handbag for elegance."
}
]

}

setOutfits(outfitsData)

/* generate images */

const withImages=await Promise.all(
outfitsData.map(async(o)=>{

const imageUrl=await generateOutfitImage(o.name,o.items,o.vibe)

return {...o,imageUrl:imageUrl||undefined}

})
)

setOutfits(withImages)

}catch(e){

console.error(e)

setOutfits([
{
name:"Casual Glam",
items:["White linen shirt","High-waist trousers","Block heels"],
vibe:"Minimal",
color:"#D4B896",
emoji:"✨",
tip:"Add gold hoops to elevate the look."
}
])

}

setLoading(false)

}

/* PRODUCT PICKER */

const onProductForOutfit=(product:StoreProduct)=>{

if(activeOutfitIdx===null) return

setOutfits(prev=>
prev.map((o,i)=>
i===activeOutfitIdx
?{...o,products:[...(o.products||[]),product]}
:o
)
)

setShowProductPicker(false)
setActiveOutfitIdx(null)

}

return(
<>
<div ref={containerRef} style={{width:"100%",height:"100%"}}>

<button
onClick={makeOutfits}
disabled={!occasion||loading}
>
{loading?"Styling...":"✨ Make Outfits"}
</button>

{outfits.map((o,i)=>(
<div key={i}>
<h3>{o.name}</h3>
{o.imageUrl&&<img src={o.imageUrl} width="200"/>}
<p>{o.tip}</p>
</div>
))}

</div>

{showProductPicker&&(
<ProductPickerModal
onSelect={onProductForOutfit}
onClose={()=>setShowProductPicker(false)}
title="Add to Look"
/>
)}

</>
)

}
