import type {CompetitionStanding} from './api';
import {resultFeedback} from './result-feedback';
export async function resultCard(result:CompetitionStanding,title:string,local:boolean){
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;
 const c=canvas.getContext('2d');if(!c)throw new Error('This browser cannot create a result image. Use the share link instead.');
 const feedback=resultFeedback(result.score,result.total,result.underReview);
 const box=(x:number,y:number,w:number,h:number,r:number,fill:string)=>{c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
 const text=(value:string,x:number,y:number,size:number,color='#192c43',weight=600)=>{c.fillStyle=color;c.font=`${weight} ${size}px Arial, sans-serif`;c.fillText(value,x,y);};
 c.fillStyle='#f4f1e8';c.fillRect(0,0,1200,800);
 box(35,35,1130,730,22,'#192c43');box(35,35,1130,722,22,'#fffdf7');
 box(35,35,1130,100,22,feedback.celebrate?'#ffd24c':'#2f5bd6');c.fillStyle=feedback.celebrate?'#ffd24c':'#2f5bd6';c.fillRect(35,100,1130,35);
 text('RAYTECH INSTITUTE',70,95,26,feedback.celebrate?'#192c43':'#ffffff',900);
 text(feedback.title,70,204,37,'#192c43',900);
 let size=30;while(size>18){c.font=`700 ${size}px Arial`;if(c.measureText(result.displayName).width<650)break;size--;}
 text(result.displayName,70,253,size,'#50647f',700);
 box(70,290,610,230,16,feedback.celebrate?'#fff1c3':'#e7eefc');
 text('CORRECT ANSWERS',95,328,15,'#4f6380',800);
 text(String(result.score),90,463,128,'#192c43',900);c.font='900 128px Arial';const width=c.measureText(String(result.score)).width;text(`/ ${result.total}`,100+width,458,53,'#61758f');
 box(720,290,400,230,16,'#e7eefc');text('ACCURACY',745,328,15,'#4f6380',800);text(`${feedback.percentage}%`,740,419,75,'#192c43',900);
 box(745,455,345,10,5,'#c4d0e3');if(feedback.percentage>0)box(745,455,345*feedback.percentage/100,10,5,'#2f5bd6');
 const final=result.endsAt&&Date.now()>=Date.parse(result.endsAt);
 text(result.underReview?'RESULT UNDER REVIEW':result.rank?`${final?'FINAL':'CURRENT'} RANK #${result.rank}`:'PRACTICE / NOT RANKED',70,564,18,'#345888',800);
 text(title.slice(0,62),70,604,21,'#53677f');
 text(feedback.celebrate?'Keep the momentum. Invite a friend to try.':'Practise. Build confidence. Try again.',70,660,24,'#192c43',800);
 text('raytechinstitute.com/competition/',70,698,21,'#2f5bd6',700);
 text(local?'Preview / practice card. Not a verified live ranking.':`Verify: raytechinstitute.com/competition/results/?result=${result.resultId}`,70,739,13,'#64758a',500);
 return new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('The image could not be created.')),'image/png'));
}
