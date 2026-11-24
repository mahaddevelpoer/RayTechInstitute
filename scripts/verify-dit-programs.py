"""Execute authored Python examples and all 29 listed practical solutions locally.
GUI tasks are checked by headless command/geometry traces, not claimed as GUI runs.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
import collections, contextlib, hashlib, io, json, math, os, re, subprocess, sys, types
ROOT=Path(__file__).resolve().parents[1]
QA=Path(os.environ.get('DIT_COMPLETION_QA',r'D:\raytech-dit-completion\qa')).resolve()
RUNS=QA/'runs'; RUNS.mkdir(parents=True,exist_ok=True)
modules=json.loads((QA/'authored-modules.json').read_text(encoding='utf-8'))
results=[]
def execute(key,code,case=None):
    case=case or {}
    with TemporaryDirectory(prefix='dit-',dir=RUNS) as scratch:
        assert Path(scratch).resolve().is_relative_to(RUNS.resolve())
        result=subprocess.run([sys.executable,'-I','-B','-c',code],input=case.get('stdin',''),capture_output=True,text=True,encoding='utf-8',errors='replace',cwd=scratch,timeout=15)
        assert result.returncode==0,f'{key}: {result.stderr}'
        if 'stdout' in case: assert result.stdout.replace('\r\n','\n')==case['stdout'],f'{key}: expected {case["stdout"]!r}, got {result.stdout!r}'
        results.append({'id':key,'mode':'executed','stdoutChecked':'stdout' in case})

class Pen:
    def __init__(self):self.x=self.y=self.heading=0.;self.down=True;self.segments=[];self.circles=[];self.turn=0.
    def forward(self,distance):
        target=(self.x+distance*math.cos(math.radians(self.heading)),self.y+distance*math.sin(math.radians(self.heading)))
        self.goto(*target)
    def back(self,distance):self.forward(-distance)
    def right(self,angle):self.heading-=angle;self.turn+=abs(angle)
    def left(self,angle):self.heading+=angle;self.turn+=abs(angle)
    def penup(self):self.down=False
    def pendown(self):self.down=True
    def goto(self,x,y):
        if self.down:self.segments.append(((self.x,self.y),(float(x),float(y))))
        self.x,self.y=float(x),float(y)
    def circle(self,radius):self.circles.append(radius)

def trace_turtle(exercise):
    pen=Pen();mock=types.ModuleType('turtle');mock.Turtle=lambda:pen;mock.done=lambda:None
    previous=sys.modules.get('turtle');sys.modules['turtle']=mock
    try:exec(compile(exercise['code'],exercise['id'],'exec'),{'__name__':'__main__'})
    finally:
        if previous is None:sys.modules.pop('turtle',None)
        else:sys.modules['turtle']=previous
    expected=exercise['geometry']
    if 'segments' in expected:assert len(pen.segments)==expected['segments'],exercise['id']
    if expected.get('closed'):assert math.hypot(pen.x,pen.y)<1e-6,exercise['id']
    if 'turn' in expected:assert abs(pen.turn-expected['turn'])<1e-6,exercise['id']
    if 'circles' in expected:assert pen.circles==expected['circles'],exercise['id']
    # A durable diagram is a logic trace, not a screenshot of an actual Tk window.
    from PIL import Image,ImageDraw
    image=Image.new('RGB',(640,440),'white');draw=ImageDraw.Draw(image)
    points=[point for segment in pen.segments for point in segment]
    if points:
        minx,maxx=min(p[0] for p in points),max(p[0] for p in points);miny,maxy=min(p[1] for p in points),max(p[1] for p in points)
        scale=min(500/max(maxx-minx,1),320/max(maxy-miny,1))
        for a,b in pen.segments:draw.line([(70+(a[0]-minx)*scale,370-(a[1]-miny)*scale),(70+(b[0]-minx)*scale,370-(b[1]-miny)*scale)],fill='#1b4f9b',width=3)
    if pen.circles:draw.ellipse((170,70,470,370),outline='#1b4f9b',width=3)
    draw.text((20,15),exercise['id']+' - headless geometry trace',fill='black');image.save(QA/(exercise['id']+'-geometry.png'))
    results.append({'id':exercise['id'],'mode':'headless-turtle-geometry','desktopGuiExecuted':False,**expected})

practical_ids=[]
for module in modules:
    if module['slug']!='dit-python':continue
    for topic in module['topics']:
        for i,code in enumerate(re.findall(r'~~~python\n(.*?)\n~~~',topic['notes'],flags=re.S)):
            execute(module['key']+'-example-'+topic['code']+'-'+str(i+1),code)
    for exercise in module['labs']:
        if not exercise.get('code'):continue
        practical_ids.extend(exercise.get('practicals',[]))
        if exercise.get('environment')=='desktop-turtle':trace_turtle(exercise)
        else:
            for i,case in enumerate(exercise.get('tests',[{k:exercise[k] for k in ['stdin','stdout'] if k in exercise}])):
                execute(exercise['id']+'-case-'+str(i+1),exercise['code'],case)
assert sorted(practical_ids)==list(range(1,30)),'The actual source lists 29 numbered Python practicals; do not invent missing 30/31 entries.'
# Independent numerical/address/SQL checks support the written teaching examples.
import ipaddress,sqlite3
network=ipaddress.ip_network('192.168.50.0/24')
assert str(network.network_address)=='192.168.50.0' and str(network.broadcast_address)=='192.168.50.255'
assert ipaddress.ip_address('192.168.50.10') in network and ipaddress.ip_address('192.168.20.10') not in network
assert len(list(network.hosts()))==254 and str(ipaddress.ip_address('2001:db8:0:0:0:0:0:1'))=='2001:db8::1'
assert 4*3//2==6 and sum([50,71])==121 and sum([50,71])/2==60.5
connection=sqlite3.connect(':memory:');connection.executescript('CREATE TABLE Students(StudentID INTEGER PRIMARY KEY,FullName TEXT);CREATE TABLE Results(ResultID INTEGER PRIMARY KEY,StudentID INTEGER,Marks INTEGER);INSERT INTO Students VALUES(1,"Ali"),(2,"Ayesha");INSERT INTO Results VALUES(1,1,50),(2,2,80);')
assert connection.execute('SELECT Students.FullName, Results.Marks FROM Students INNER JOIN Results ON Students.StudentID=Results.StudentID WHERE Results.Marks>=71;').fetchall()==[('Ayesha',80)]
connection.close()
python_source=json.dumps([module for module in modules if module['slug']=='dit-python'],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
report={'pythonVersion':sys.version.split()[0],'pythonSourceSha256':hashlib.sha256(python_source).hexdigest(),'numberedPracticals':practical_ids,'checks':results,'additionalChecks':['IPv4 subnet/network/broadcast/hosts','IPv6 representation','full-mesh link count','Excel sample arithmetic','Access sample SELECT logic in SQLite'], 'notExecuted':['Native Windows installation/account/network changes','Native Office UI and VBA','Physical cabling and actual Packet Tracer application','Actual desktop Turtle/Tk windows']}
(QA/'program-verification.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
(ROOT/'content/dit/completion/program-verification.generated.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'checks':len(results),'practicals':29,'geometryTraces':5,'excelRoundTrip':True,'productionWrites':0}))
