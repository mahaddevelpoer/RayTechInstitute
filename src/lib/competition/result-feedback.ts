export function resultFeedback(score:number,total:number,underReview=false){
 const percentage=total>0?Math.round(score/total*100):0;
 if(underReview)return {percentage,tier:'review',celebrate:false,title:'Your result is being reviewed.',message:'Your attempt is saved. Your public rank will be available after the review.',next:'You can keep practising while your result is reviewed.'};
 if(percentage>=80)return {percentage,tier:'strong',celebrate:true,title:percentage===100?'A perfect paper. Well played!':'A strong finish. You earned it.',message:'Your preparation shows. Take a moment to enjoy this result, then keep building on what you know.',next:percentage===100?'Keep your skills sharp with a fresh practice run.':'Revisit the questions that challenged you and aim for a personal best.'};
 if(percentage>=50)return {percentage,tier:'building',celebrate:false,title:'A good start. Keep building.',message:'Some ideas are already clicking. A little more practice can turn the uncertain answers into confident ones.',next:'Pick one topic to revisit, then try a fresh practice run.'};
 return {percentage,tier:'practice',celebrate:false,title:'This is a starting point.',message:'This round was tough. One score does not define you. Slow down, revisit the basics and give yourself another chance.',next:'Try again after a little practice. Your next attempt can be stronger.'};
}
