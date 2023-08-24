
// generate new presen
var scene = new Ns_Presentation(1);
// set an simple check box
scene.add(new Simple_Checkbox(120,120,RMswitch,1));

// then set it to Manager 
NsGUImgr.presentations.push(scene);

deblog("scene loaded");
