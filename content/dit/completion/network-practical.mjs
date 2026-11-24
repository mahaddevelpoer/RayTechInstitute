import {q,t,lab} from './authoring.mjs';
export default [{key:'network-8',subject:'Computer Networks',slug:'dit-computer-science',book:'Computer Networking',module:8,chapter:13,title:'Networking Practical Workbook',pages:'21-22',sources:[['Cisco Packet Tracer help','https://tutorials.ptnetacad.net/help/default/intro.htm'],['Cisco first Packet Tracer lab','https://tutorials.ptnetacad.net/help/default/myFirstPTLab.htm'],['Microsoft ipconfig','https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig'],['Microsoft ping','https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping']],topics:[
t('8.1-8.2','Modem, DSL and the authorised lab boundary',`A DSL modem connects an authorised subscriber line to a digital network service. A router forwards between IP networks; an access point connects wireless stations to a LAN. One consumer device can combine these functions, so identify the labelled ports and actual role rather than assuming every box is only a modem.

Use a spare instructor-owned device or a simulator/configuration worksheet. Record its model, management address, intended LAN settings and recovery configuration. ISP-specific values such as account credentials, connection type and DSL parameters must come from the authorised lab/ISP configuration. A factory reset can remove working settings and is not an acceptable first troubleshooting step on a live subscriber device.

Distinguish the small telephone-style DSL connector from the Ethernet 8P8C connector commonly called RJ-45. Connect the specified cable to its labelled port, then test DSL synchronisation, local LAN access, gateway routing and DNS separately. An illuminated wireless indicator does not prove that the DSL service is established.

All configuration examples here belong to an isolated training network. They are instructions for an assessed lab, not changes executed on the reader's own network.`,[
q('Which role forwards packets between IP networks?','Router',['Passive cable tester','Keyboard','Paper tray'],'Routing connects different IP networks.'),
q('Can a consumer device combine modem, router and access-point functions?','Yes',['No, every device can have exactly one role','Only if it has no power','Only when used as a printer'],'Several network functions can be integrated in one product.'),
q('Where should ISP-specific DSL parameters come from?','The authorised ISP/lab configuration',['An unrelated subscriber password','A guessed public example applied to a live connection','The monitor resolution'],'Connection parameters must match the authorised service.'),
q('Why avoid a casual factory reset of a working subscriber router?','It can erase required connection and access settings',['It always improves every connection automatically','It changes only the wallpaper','It cannot affect configuration'],'Resetting is a configuration-changing action requiring a recovery plan.'),
q('Does a Wi-Fi indicator prove DSL synchronisation and Internet service?','No',['Yes, every status layer is identical','Yes, no other test is needed','Only if the SSID is short'],'Wireless association, DSL link and end-to-end service are distinct checks.'),
q('Which equipment belongs in this configuration exercise?','An authorised spare device or isolated simulation',['A random live office router','A neighbour\'s connection without permission','An uncontrolled public access point'],'The exercise must remain within the assigned training environment.')]),
t('8.3','Straight-through Ethernet cabling',`A straight-through cable uses the same approved pair-assignment scheme at both ends, such as T568B to T568B. The pin-number order for T568B is white/orange, orange, white/green, blue, white/blue, green, white/brown and brown. T568A uses white/green, green, white/orange, blue, white/blue, orange, white/brown and brown. Verify the plug manufacturer's contact numbering and orientation instead of guessing from an unlabelled drawing.

In the lab, use disconnected training cable, suitable connectors, a stripping/crimping tool and a cable tester. Cut to the assigned length, prepare the jacket without damaging conductors, keep the pairs twisted appropriately near the termination, arrange the chosen order, trim evenly, seat the conductors fully and crimp. Repeat the same scheme at the other end, then inspect and test the wire map.

For the historical 10/100 Ethernet exercise, a host-to-hub/switch link is commonly demonstrated with a straight-through cable. Many newer ports support auto-MDI-X, so a working connection does not by itself prove that a cable has the intended pin map. A basic continuity tester is also not a full certification of category performance. Record both the wire-map result and the functional link test.`,[
q('Which termination pair is straight-through?','T568B at both ends',['T568A at one end and T568B at the other as the standard straight-through definition','Random conductor order at each end','Only one terminated end'],'A straight-through lead uses corresponding pin assignments at both ends.'),
q('What are T568B pins 1 and 2?','White/orange and orange',['White/green and green','Blue and white/blue','Brown and white/brown'],'These are the first pair assignments in the listed T568B scheme.'),
q('Why use a cable tester after crimping?','Check the actual conductor wire map and continuity',['Prove every possible Ethernet performance requirement with any basic tester','Replace every device driver','Assign an IP address to the cable'],'A basic tester checks defined wiring properties, not all performance characteristics.'),
q('Does an auto-MDI-X link prove that a lead has the intended training pin map?','No',['Yes, the port rewires the actual connector permanently','Yes, testing becomes unnecessary','No, because auto-MDI-X always prevents links'],'Port adaptation and physical wire-map verification are different matters.')]),
t('8.4','Legacy crossover cables and direct connections',`For the syllabus's legacy 10/100 crossover exercise, T568A at one end and T568B at the other crosses the transmit/receive pair positions: pins 1 and 2 correspond to 3 and 6 at the opposite end. This is not a universal statement of every Gigabit Ethernet crossover arrangement; follow the actual interface/cabling specification.

Build and test the assigned disconnected training lead, then connect the authorised lab hosts. Give their adapters unique compatible static addresses, such as 192.168.40.10/24 and 192.168.40.11/24, and test permitted peer reachability. A gateway is not required merely to exchange same-subnet traffic between these two hosts.

Older like-to-like hub/switch connections can be used to demonstrate the historical crossover requirement. On auto-MDI-X equipment, the port can adapt, so describe the observed interface capability. Record the wiring test, link state, address configuration and peer test separately. Do not say that every modern host-to-host connection always requires a manually crossed cable.`,[
q('Which termination pair is the listed legacy 10/100 crossover example?','T568A to T568B',['T568B to T568B','T568A to T568A','An unterminated cable'],'The schemes exchange the listed transmit/receive pair positions.'),
q('Which pair positions cross in the described legacy 10/100 example?','1/2 with 3/6',['Only 4 with 5','Only 7 with 8','No pair positions'],'The exercise concerns the historical 10/100 transmit/receive pair mapping.'),
q('Do two hosts in one /24 always need a gateway to communicate directly?','No, ordinary same-subnet traffic is on-link',['Yes, a gateway is required for every local frame','Yes, DNS is always the gateway','No, because addresses are unnecessary'],'A gateway is used when the routing decision requires an off-link path.'),
q('Why mention auto-MDI-X?','Modern interface adaptation can change the observed cable requirement',['It removes every need for address configuration','It guarantees unlimited speed','It is a type of printed homework'],'Do not generalise legacy cabling rules to every modern interface.')]),
t('8.5','Troubleshooting commands and evidence',`Use commands to answer specific questions, not as a collection of magic fixes. On the assigned Windows lab host:

~~~console
hostname
ipconfig
ipconfig /all
ping 192.168.40.11
arp -a
tracert 192.168.40.11
~~~

hostname reports the local name. ipconfig shows adapter configuration, and /all adds details. ping uses ICMP echo to test a particular path under its policy conditions. arp -a displays learned IPv4 neighbour-cache information; it is not a guaranteed inventory of every host. tracert attempts to reveal hops through returned responses; asterisks can reflect filtering or missing replies rather than proving that the entire path is down.

ipconfig /release and /renew concern DHCP configuration and can interrupt the lab connection. Use them only on the assigned DHCP test adapter when the exercise calls for it. They are not general repairs for an incorrectly configured static address. Record before/after configuration and the exact symptom. Do not copy real MAC addresses, subscriber credentials or private client information into public reports.`,[
q('Which command reports the local Windows host name?','hostname',['printqueue','slideorder','papername'],'hostname reports the local computer name.'),
q('Which command shows detailed adapter configuration?','ipconfig /all',['ipconfig /wallpaper','ping /font','arp /slide'],'The /all option adds adapter configuration details.'),
q('What does arp -a primarily display?','Learned IPv4 neighbour-cache entries',['A guaranteed complete directory of every Internet device','Only DNS zone files','Only stored Wi-Fi passwords'],'The cache contains learned address-resolution information.'),
q('What does a ping success establish?','An ICMP result for the tested destination/path',['Every application permission is correct','Every website is authentic','All remote ports are open'],'ICMP reachability is not a universal service or authorisation test.'),
q('Do tracert asterisks necessarily prove the whole route is unusable?','No, responses can be filtered or absent',['Yes, every asterisk means the disk failed','Yes, all following hops must be physically missing','No, because tracert never sends packets'],'Hop-response behaviour must be interpreted with other evidence.'),
q('When are release/renew appropriate in this workbook?','On the assigned DHCP lab adapter when requested',['On every live adapter regardless of impact','As a way to correct every static address automatically','As a replacement for recording symptoms'],'The operations affect DHCP configuration and can disrupt a connection.'),
q('What should be recorded before changing a lab network setting?','The symptom and current relevant configuration',['Only a favourite colour','Only the final success claim','An unrelated account password'],'Before/after evidence makes troubleshooting assessable.'),
q('Does a static-address fault necessarily disappear after DHCP renew?','No',['Yes, every static setting is always replaced correctly','Only if the monitor is larger','Only if the computer name is shorter'],'Diagnose the actual configuration method and fault.')]),
t('8.6','Packet Tracer networks, management and routing',`Install Packet Tracer from Cisco's authorised learning/download route using the permitted account, or use the lab's existing installation. Interface models differ: select devices with enough ports and use their actual port names. The simulator is an educational model, so a successful simulated packet is not proof of physical cable quality or every real-device feature.

Start with two PCs connected to a switch, give them unique addresses in 192.168.10.0/24 and test a permitted ping. Add hosts gradually and maintain an address table. For the two groups of ten in the syllabus, choose sufficient hub capacity or linked hubs with enough PC ports plus uplinks. Connect the hub groups through a switch and keep the same subnet when demonstrating one bridged LAN. A switch alone does not route arbitrary different IP subnets.

A management IP identifies a switch management interface; ordinary layer-2 switching between hosts does not require assigning a unique IP to each data port. A typical isolated example uses the model's VLAN 1 interface at 192.168.10.2/24 and at least one active port in that VLAN. Adapt interface names to the selected model:

~~~console
enable
configure terminal
hostname LAB-SW
interface vlan 1
ip address 192.168.10.2 255.255.255.0
no shutdown
exit
ip default-gateway 192.168.10.1
end
show ip interface brief
copy running-config startup-config
~~~

The gateway line is meaningful only when the planned router at .1 exists. For two different networks, use a router with one interface in each subnet. For example, a router at 192.168.10.1/24 and 192.168.20.1/24 connects PC-A 192.168.10.10/24 and PC-B 192.168.20.10/24, each using its local router interface as gateway. Bring up the assigned interfaces, check connected routes and test local gateway before the remote host.

For a WLAN, add an authorised simulated access point and compatible wireless clients, configure the same intended SSID/security and then verify the IP plan and peer connectivity. Wireless association alone does not prove the higher-layer task. Save the .pkt lab and a screenshot/table of the expected and observed results.

For the routed example, place one switch and host on each side of a two-interface router. Connect the assigned device ports. On a model whose interfaces have these names, the introductory router configuration is:

~~~console
enable
configure terminal
hostname LAB-R
interface gigabitEthernet0/0
ip address 192.168.10.1 255.255.255.0
no shutdown
exit
interface gigabitEthernet0/1
ip address 192.168.20.1 255.255.255.0
no shutdown
end
show ip interface brief
show ip route
copy running-config startup-config
~~~

Replace interface names only according to the selected simulator model. In each PC's Desktop/IP Configuration, set its address, mask and its own local gateway as shown in the diagram. Verify both connected /24 routes and interface state. Ping each local gateway, then the remote host; initial address-resolution work can affect the first attempt. Save the .pkt file and record actual results rather than claiming a physical router was configured.`,[
q('What is a useful first Packet Tracer LAN exercise?','Two PCs, a switch, compatible unique addresses and a peer test',['Twenty unaddressed hosts with random cables and no plan','Only renaming the simulator icon','Deleting every host after placing it'],'A small checked baseline makes later changes easier to diagnose.'),
q('What should a two-group hub exercise account for?','Enough host ports and uplinks on the chosen models',['Only the displayed device colour','No need for any address table','A claim that one eight-port hub has unlimited ports'],'Actual port capacity constrains the topology.'),
q('Does a layer-2 switch by itself route every pair of different IP subnets?','No',['Yes, any management address creates all routes','Yes, every switch port is automatically a router','No, because switches cannot forward frames'],'Inter-subnet forwarding requires appropriate layer-3 routing.'),
q('What does a switch management IP primarily support?','Reaching its management interface',['Replacing host IP addresses on every data port','Making all connected hosts share the same IP','Changing a copper cable into fibre'],'Management addressing is distinct from ordinary layer-2 frame forwarding.'),
q('Which gateway suits PC-B 192.168.20.10/24 in the given routed lab?','192.168.20.1',['192.168.10.10','192.168.10.255','192.168.20.255'],'The gateway must be the reachable local router interface.'),
q('What should be tested before a remote-subnet ping?','Local adapter/link settings and the local gateway',['Only the slide show mode','Only an unrelated website','Only printer margins'],'Layered tests help locate the fault.'),
q('What does a successful simulation not prove?','The real cable meets physical performance specifications',['The saved lab file can be inspected','A simulated path was exercised','The specified virtual hosts exist in the lab'],'Simulation does not replace physical certification.'),
q('What should accompany a saved .pkt file?','An address/port plan and expected-versus-observed evidence',['Only real subscriber passwords','Only a claim that nothing can fail','Only an unrelated photo'],'The lab should be reproducible and assessable.')])
],short:[['Compare a modem, router and access point.','A modem handles the service-link signalling context, a router forwards between IP networks and an access point connects wireless stations to a LAN. One product can combine these functions.'],['State the straight-through rule.','Use the same approved assignment scheme at both ends, such as T568B/T568B, and verify the actual wire map.'],['State the legacy crossover example.','For the taught 10/100 example, use T568A at one end and T568B at the other. Do not generalise that mapping to every Gigabit or auto-MDI-X interface.'],['Why keep an address table?','It makes host identity, subnet membership, gateways, management addresses and accidental duplicates visible.'],['What is the difference between a switch management IP and forwarding?','A management IP lets an administrator reach the switch control interface. Ordinary layer-2 frame forwarding is based on MAC/VLAN context, not a separate IP on every data port.'],['What does a lab report need?','A topology, device/port choices, address settings, permitted test actions, expected results, observed results and a saved reproducible configuration.']],long:[['Describe cable preparation and verification.','Choose the authorised disconnected training cable and appropriate connectors. Identify contact numbering, choose T568A or T568B according to the exercise and terminate both ends with the required straight/crossover assignment. Keep pair structure and seating correct, inspect the result and run a cable tester. Then test the intended lab link and compatible host configuration. A basic continuity result is not full category certification, and an auto-MDI-X link does not prove that the cable has the requested wire map.'],['Design the two groups of ten-host LAN exercise.','Plan twenty unique host addresses in one selected /24 and record every port. Use sufficient-capacity hubs or additional linked hubs so each group has ten PC ports plus its required uplinks. Join the groups using the assigned switch to demonstrate one bridged LAN. Add and test hosts gradually, check link and address configuration and record permitted peer pings within and across the groups. A layer-2 bridge does not by itself supply inter-subnet routing. Save the simulator file and evidence table.'],['Design and diagnose a two-subnet router lab.','Place one router interface in 192.168.10.0/24 and another in 192.168.20.0/24, assign unique host addresses and use each local router interface as its host gateway. Use actual model interface names, bring the required interfaces up and inspect the connected route entries. Test each host to its local gateway before remote-subnet reachability. Record failures by layer and avoid treating DNS, address conflicts, link failures and permission issues as the same symptom. The isolated simulation must not modify a live network.']],labs:[
lab('net8-identify','Identify the cable and device toolkit',['Label NIC, Ethernet 8P8C/RJ-45, telephone-style RJ-11, UTP cable, crimper and tester from lab samples.','Distinguish modem, router, switch, hub and access point functions.'],'A correct labelled inventory without live configuration changes.',{practicals:[1]}),
lab('net8-straight','Make and test a straight-through lead',['Use disconnected training materials; identify pin numbering.','Terminate B/B or the instructed A/A scheme, inspect seating and run the tester.','Connect an authorised host-to-hub/switch lab link and record the link/test result.'],'Matching pin assignments and a checked assigned link.',{practicals:[2,3]}),
lab('net8-crossover','Make a legacy crossover lead',['Terminate the assigned 10/100 training cable A/B and inspect the expected pair crossing.','Connect two authorised hosts with unique same-subnet settings and test peer reachability.','Demonstrate a permitted hub/switch interconnection and record any auto-MDI-X capability.'],'A checked wire map and documented historical versus observed interface behaviour.',{practicals:[4,5,6]}),
lab('net8-commands','Interpret network command output',['Record hostname and ipconfig /all on the assigned host or provided output sheet.','Test a permitted lab peer with ping and inspect arp -a/tracert output.','Use DHCP release/renew only in the assigned exercise and record the relevant before/after configuration.'],'A symptom-to-command table that distinguishes link, address, route, DNS and service tests.',{practicals:[7,11]}),
lab('net8-two-host','Build the first simulated LAN',['Use the authorised Packet Tracer installation and select two PCs and a switch with the required ports.','Assign .10 and .11 in the lab /24, verify links and test permitted ICMP.','Add hosts gradually while maintaining unique address entries.'],'A saved checked .pkt and an address table.',{practicals:[8,9]}),
lab('net8-wlan','Build an isolated simulated WLAN',['Add the assigned access point and compatible clients.','Set the intended SSID/security and address plan.','Check association, then addressing and peer communication separately.'],'A saved WLAN demonstration with layer-specific evidence.',{practicals:[10]}),
lab('net8-switch','Name and manage the training switch',['Use the actual model ports and hostname controls/CLI.','Assign the specified management SVI and keep an active port in its VLAN.','Connect hosts, test switching, save the configuration and explain the separate management address.'],'A named switch, checked SVI/configuration and working lab host forwarding.',{practicals:[12,13]}),
lab('net8-twenty','Join two ten-host groups',['Draw two groups with sufficient hub port capacity and uplinks.','Join the hub groups through a switch in one planned /24.','Assign twenty unique hosts and test representative within-group and across-group paths.'],'A saved twenty-host topology with correct port/address capacity and results.',{covers:['8.6.4','8.6.5']}),
lab('net8-router','Connect two different IP networks',['Place two switches, two PCs and a router with two suitable interfaces; connect the assigned ports.','Configure router interfaces 192.168.10.1/24 and 192.168.20.1/24 using the model-specific names and bring them up.','Set PC-A to 192.168.10.10/24 with gateway 192.168.10.1 and PC-B to 192.168.20.10/24 with gateway 192.168.20.1.','Inspect interface state and both connected routes; test local gateways and then remote-host reachability.','Save the configuration/.pkt and record the expected-versus-observed table.'],'A saved routed two-subnet lab and a verified path table.',{practicals:[14]})]
}];
