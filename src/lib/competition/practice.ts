// Public practice only. These questions must never seed a live competition bank.
export const competitionPractice=[
 {id:'practice-1',prompt:'Which device forwards data between different networks?',options:['Router','Keyboard','Monitor','Scanner'],correctIndex:0},
 {id:'practice-2',prompt:'What does a web browser use a URL for?',options:['Locating a resource','Measuring memory','Formatting a disk','Choosing a keyboard'],correctIndex:0},
 {id:'practice-3',prompt:'Which action best protects an important document from device failure?',options:['Keeping a separate backup','Renaming it twice','Changing its font','Opening it every day'],correctIndex:0},
 {id:'practice-4',prompt:'Which is an example of an input device?',options:['Microphone','Speaker','Projector','Printer'],correctIndex:0},
 {id:'practice-5',prompt:'What is the purpose of an operating system?',options:['Managing hardware and applications','Only writing emails','Only displaying websites','Replacing all application software'],correctIndex:0},
 {id:'practice-6',prompt:'Which Word feature is most appropriate for consistently formatted section titles?',options:['Heading styles','Random font sizes','Extra blank lines','Repeated spaces'],correctIndex:0},
 {id:'practice-7',prompt:'A student changes a shared file. Why is version history useful?',options:['It can help recover an earlier version','It guarantees the file has no mistakes','It stops the internet','It replaces a strong password'],correctIndex:0},
 {id:'practice-8',prompt:'What is a local area network usually designed to connect?',options:['Devices within a limited area','Only satellites','Every computer worldwide','Only websites'],correctIndex:0},
 {id:'practice-9',prompt:'What should you do before entering a password on a link received in a message?',options:['Check the website address and source','Trust the logo alone','Forward the password','Disable security updates'],correctIndex:0},
 {id:'practice-10',prompt:'Which is the safest way to give a document a new name while keeping the original?',options:['Save a separate copy','Delete the original first','Remove its extension','Overwrite a different document'],correctIndex:0},
];
export function practicePaper(){const paper=competitionPractice.map(question=>{const options=question.options.map((text,index)=>({text,index}));for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}return{...question,options:options.map(item=>item.text),correctIndex:options.findIndex(item=>item.index===question.correctIndex)};});for(let i=paper.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[paper[i],paper[j]]=[paper[j],paper[i]];}return paper;}
