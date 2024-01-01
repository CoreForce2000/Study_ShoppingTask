import VAS from "../views/SlideShow/components/VAS/VAS"

export const getVasSlides = (text:string, minLabel:string, maxLabel:string, setValue:(value:number)=>void): React.ReactNode => {

    return <>
      <div style={{position:"absolute", textAlign:"center", top:"1em", fontSize:"1em", color:"black"}}> 
        {text} </div>
        
      <div style={{width:"100%", padding:"1em", display:"flex", justifyContent:"left"}}>
        <div style={{backgroundColor:"white", width:"100%", marginTop:"2em"}}>
          <VAS key={text}  minLabel={minLabel} maxLabel={maxLabel} setValue={setValue} />
        </div>
      </div>
    </>
  }