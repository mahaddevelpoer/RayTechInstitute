// Explicit course-outline mapping. Grouped headings can cover several numbered
// syllabus sections; the content/keyword tests verify the corresponding text.
const range=(prefix,end)=>Array.from({length:end},(_,i)=>`${prefix}.${i+1}`);
export const requiredSections={
 'os-1':range(1,2),'os-2':['2.1',...range('2.2',7)],'os-3':range(3,5),'os-4':range(4,18),'os-5':range(5,6),'os-6':['6.1','6.2',...range('6.3',5)],
 'python-1':range(1,6),'python-2':range(2,5),'python-3':range(3,9),'python-4':range(4,3),'python-5':range(5,5),'python-6':range(6,3),'python-7':range(7,3),'python-8':range(8,4),'python-9':range(9,5),
 'office-1':range(1,3),'office-2':range(2,7),'office-3':range(3,6),'office-4':range(4,5),'office-5':range(5,5),
 'network-1':range(1,4),'network-2':['2.1','2.2.1','2.2.2'],'network-3':range(3,7),'network-4':range(4,3),'network-5':range(5,2),'network-6':range(6,3),'network-7':range(7,5),'network-8':range(8,6)
};
export const sectionAliases={
 'os-2':{'2.2.1':['2.2.2'],'2.2.3':['2.2.4','2.2.5'],'2.2.6':['2.2.7']},
 'os-3':{'3.3':['3.4']}
};
export function mappedSections(module){
 const result=new Map();
 for(const topic of module.topics){
  const code=topic.code.replace(/[a-z]$/i,'');
  const interval=code.match(/^(\d+)\.(\d+)-(\d+)\.(\d+)$/);
  const codes=interval&&interval[1]===interval[3]?Array.from({length:Number(interval[4])-Number(interval[2])+1},(_,i)=>`${interval[1]}.${Number(interval[2])+i}`):[code];
  for(const value of codes){
   result.set(value,topic.code);
   const bits=value.split('.');while(bits.length>2){bits.pop();result.set(bits.join('.'),topic.code)}
   for(const alias of sectionAliases[module.key]?.[value]||[])result.set(alias,topic.code);
  }
 }
 return result;
}
export const requiredTerms={
 'os-1':['batch','multiprogramming','multiprocessing','multitasking','real-time','time sharing','distributed','Android','iOS','iPadOS'],
 'os-2':['system call','user interface','memory','process management','file management','authentication','authorisation','deadlock','critical section'],
 'os-3':['new','ready','running','waiting','terminated','PCB','register','stack','threads'],
 'os-4':['requirements','Rufus','boot','partition','Start menu','taskbar','Settings','VGA','AGP','sound','wired','wireless','uninstall','standard account','tablet mode','Task View','workgroup','DSL','hotspot','Defender','Urdu','scanner'],
 'os-5':['workgroup','subnet','gateway','DNS','share permissions','file-system permissions','printer','observed'],
 'os-6':['client','server','AD DS','domain controller','DHCP','scope','DNS','AAAA','WINS','print'],
 'python-1':['machine','assembly','algorithm','compiler','interpreter','Guido','1991'],
 'python-2':['PyCharm','interpreter','Hello','comments','indentation','syntax','runtime','logical'],
 'python-3':['assignment','type(','arithmetic','floor','conversion','Boolean','short-circuit'],
 'python-4':['Unicode','immutable','capitalize','len(','lower','upper','strip','replace','startswith','endswith'],
 'python-5':['append','extend','insert','remove','pop','slice','membership','shallow'],
 'python-6':['if','elif','else','range','50','51','70','71','100'],
 'python-7':['for','while','break','continue','accumulator','factorial','zero'],
 'python-8':['parameter','argument','return','print','scope','default','tuple'],
 'python-9':['forward','back','left','right','star','rectangle','square','circle','pandas','read_excel','to_excel','NumPy','Matplotlib','Tkinter','Django','Kotlin','MicroPython','Pygame'],
 'office-1':['open-source','proprietary','Word','Excel','PowerPoint','Access','title bar','Quick Access Toolbar','Ribbon','status bar'],
 'office-2':['editing','template','Find','Replace','AutoCorrect','Format Painter','WordArt','Clear Formatting','hanging','first-line','line spacing','section break','AutoFit','Urdu'],
 'office-3':['workbook','worksheet','formula bar','relative','absolute','mixed','SUM','COUNT','COUNTA','COUNTBLANK','AVERAGE','MIN','MAX','IF','AND','OR','SUMIF','COUNTIF','LEFT','RIGHT','MID','TRIM','UPPER','LOWER','CONCATENATE','chart','Developer','macro','.xlsm'],
 'office-4':['layout','duplicate','handout','text box','table','chart','transition','animation','motion path','Presenter View','Zoom','2016'],
 'office-5':['Datasheet','Design View','primary key','foreign key','referential integrity','form','report','query','AND','OR','INNER JOIN'],
 'network-1':['sender','receiver','message','medium','protocol','LAN','MAN','WAN','VLAN','VPN'],
 'network-2':['bus','star','ring','mesh','hybrid','Wi-Fi','satellite','radio'],
 'network-3':['node','NIC','modem','hub','switch','access point','USB','router'],
 'network-4':['10BASE2','10BASE5','10BASE-T','100BASE-X','BNC','UTP','Cat2','Cat3','Cat4','Cat5','Cat6','RJ-45','single-mode','multimode','Bluetooth','microwave','satellite','radio','WLAN'],
 'network-5':['Application','Presentation','Session','Transport','Network','Data Link','Physical','encapsulation','four-layer','five'],
 'network-6':['32','128','Class A','Class B','Class C','Class D','Class E','CIDR','multicast','IPv6','prefix'],
 'network-7':['routed','routing','RIP','OSPF','EIGRP','BGP','TCP','UDP','FTP','FTPS','SFTP','HTTPS'],
 'network-8':['DSL','T568A','T568B','crossover','auto-MDI-X','ipconfig /all','release','renew','arp -a','hostname','tracert','Packet Tracer','management','ten','gateway']
};
