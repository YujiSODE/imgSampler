/*draw2Sample.js
*
*    Copyright (c) 2016 Yuji SODE <yuji.sode@gmail.com>
*
*    This software is released under the MIT License.
*    See LICENSE or http://opensource.org/licenses/mit-license.php
*/
//the interface for graphical sampling with img/canvas tag on Firefox.
function draw2Sample(){
//============================================================================
  var slf=window,W,r9=slf.Math.random().toFixed(9).replace(/\./g,'');
  //=== element generator ===
  var f=function(elName,elId,targetId){
    var t=slf.document.getElementById(targetId),E=slf.document.createElement(elName);
    E.id=elId;
    return t.appendChild(E);
  };
  //=== it returns target element tag array. ===
  var tAr=function(A){
    //A is an array of tag name; e.g. A=['canvas','img'].
    var Ar=[],tg;
    for(var i=0;i<A.length;i+=1){
      tg=slf.document.getElementsByTagName(A[i]);
      for(var j=0;j<tg.length;j+=1){Ar.push(tg[j]);}
    }
    return Ar;
  };
  //=== it sets target image to canvas. ===
  var setImg2Cvs=function(tgtCvs,srcImg){
    var fig=new Image(),c,W,H;
    if(!srcImg){slf.alert('img/canvas tag is not available');return;}
    W=srcImg.width||9,H=srcImg.height||9;
    if(!!srcImg.src){
      fig.src=srcImg.src;
    }else{
      fig=srcImg;
    }
    tgtCvs.width=W,tgtCvs.height=H;
    c=tgtCvs.getContext('2d');
    c.drawImage(fig,0,0,W,H);
  };
  //=== it sets CSS style to target tag. ===
  var setCss=function(tgt,n,pos){
    var s=tgt.style;
    s.position=pos,s.top='0px',s.left='0px',s['z-index']=n;
  };
  //=== it returns default values for input tag. ===
  var getDefault=function(tgtCanvas){
    var xw=0+','+tgtCanvas.width;
    return [xw,10,xw];
  };
  //=== it draws given area of canvas. ===
  var getCArea=function(tgtCanvas,A,rgba){
    //A is an array:[x0,width].
    if(A.length<2){return;}
    var c=tgtCanvas.getContext('2d');
    c.fillStyle=rgba,c.fillRect(+A[0],0,+A[1],tgtCanvas.height);
  };
  //=== it shows given sampling interval on canvas. ===
  var getSplL=function(tgtCanvas,A,iv){
    //A is an array:[x0,width];iv is sampling interval.
    if(+iv<2){return;}
    if(A.length<2){return;}
    var c=tgtCanvas.getContext('2d'),L=+A[1]/+iv;
    c.strokeStyle='rgba(0,0,0,1)',c.lineWidth=(L-1)/L,c.beginPath();
    for(var i=0;i<+iv;i+=1){
      c.moveTo(+A[0]+i*L,0),c.lineTo(+A[0]+i*L,tgtCanvas.height);}
    c.stroke();
  };
  //=== it clears target canvas tag. ===
  var clrCs=function(tgtCanvas){
    var c=tgtCanvas.getContext('2d');
    c.clearRect(0,0,tgtCanvas.width||9,tgtCanvas.height||9);
  };
  //=== it draws on target canvas tag. ===
  var dr=function(e,cvsTg,rgba,lW){
    //e: event, cvsTg: target canvas tag, [rgba: color, lW: line width].
    //dr.d[0]=flag:true|false, dr.d[1]=x0, dr.d[2]=y0
    if(!dr.d){dr.d=[false,0,0];}
    var c,x,y,D=dr.d;
    /*Event: mousedown*/
    if(!(e.type!='mousedown')){D[0]=true,D[1]=e.clientX,D[2]=e.clientY;}
    /*Event: mouseup*/
    else if(!(e.type!='mouseup')){D[0]=false;}
    /*Event: mousemove|mouseout*/
    else if(!(e.type!='mousemove')||!(e.type!='mouseout')){
      if(D[0]){
        x=e.clientX,y=e.clientY;
        c=cvsTg.getContext('2d'),c.strokeStyle=rgba,c.lineWidth=lW;
        c.beginPath(),c.moveTo(D[1],D[2]),c.lineTo(x,y),c.stroke();
        D[1]=x,D[2]=y;
        if(!(e.type!='mouseout')){D[0]=false;}
      }
    }
  };
  //=== it returns Image data sample of target canvas tag with given interval. ===
var gtImSpl=function(Id,A,iv){
  //Id and iv are target canvas id and sampling interval.
  //A is an array:[x0,width].
  if(+iv<2){return;}
  var B=[],c=slf.document.getElementById(Id).getContext('2d'),L=+A[1]/+iv;
  for(var i=0;i<+iv;i+=1){B.push('['+c.getImageData(+A[0]+i*L,0,1,c.canvas.height).data.join()+']');}
  return '['+B.join()+']';
};
  //=== it draws a graph and returns log object. ===
  var drGrh=function(d,v,id){
    //d=[x0@f(x0), ..., x@f(x)];v=[[x0,w],[interval],[v0,v]];id is id of given canvas.
    var l=+v[0][1]/+v[1],unit=+((+v[2][1]-v[2][0])/+v[0][1]),n=d.length,c=slf.document.getElementById(id).getContext('2d'),X,V=[];
    c.strokeStyle='rgba(255,0,0,1)',c.lineWidth=1;
    X=d[0].split('@'),c.beginPath(),c.moveTo(+v[0][0],X[1]);
    V.push(v[2][0]+'@'+(+c.canvas.height-X[1]));
    for(var i=1;i<n;i+=1){
      X=d[i].split('@'),c.lineTo(+v[0][0]+X[0]*l,X[1]);
      V.push((+v[2][0]+X[0]*l*unit)+'@'+(+c.canvas.height-X[1]));
    }
    c.stroke();
    return {dataLog:d.join(),'x@f(x)':V.join()};
  };
//============================================================================
/*id*/
  var divId='div_'+r9,fmId='fm_'+r9,fResId=fmId+'Result',cvsId='cvsId_'+r9,slcId='slcId_'+r9,BId='B_'+r9,resId='result_'+r9,adrsId='address_'+r9,
      /*<div and form>*/
      tgtDiv,fm,fRes,
      /*<list of img/canvas tag>*/
      slctLbl,slct,tgtTg,sptOpt,
      /*<set default image>*/
      /*generating canvas tag*/
      cvsDiv,cvs=[],cvsP=[],cvsPLb=[],deftV,cW,cH,idCvs,WH,
      /*set parameters for canvas*/
      pDiv,
      /*<image select event>*/
      cvsPV=[],
      /*<parameter change event>*/
      pV,
      /*<bottun>*/
      clearB,splLB,clSpB,cDrB,splB,closeB,_div,_r,
      /*sampling from given canvas*/
      a,iV,spt,b,U,d,v=[],t='',
      /*<result>*/
      resLbl,resIp,br01,rstB,adLbl,adIp,sbB,
 bd=slf.document.getElementsByTagName('body')[0];
  bd.id='bd_'+r9;
  //=== <div and form> ===
  tgtDiv=f('div',divId,bd.id),bd.removeAttribute('id');
  fm=f('form',fmId,divId);
  //form for output
  fRes=f('form',fResId,divId),fRes.name='Result',fRes.action='mailto:123.ex@qwerty.com?subject='+slf.document.getElementsByTagName('title')[0].innerHTML,fRes.method='post',fRes.enctype='text/plain';
  //=== </div and form> ===
  //====== <list of img/canvas tag> ======
  slctLbl=f('label',slcId+'label',fmId),slctLbl.innerHTML='Target Tag:';
  slct=f('select',slcId,slctLbl.id);
  tgtTg=tAr(['canvas','img']);
  sptOpt=[];
  for(var i=0;i<tgtTg.length;i+=1){
    sptOpt[i]=f('option',slcId+'_opt'+i,slcId),sptOpt[i].value=i,sptOpt[i].innerHTML=tgtTg[i].id||i+'th_'+tgtTg[i].tagName;
  }
  //====== </list of img/canvas tag> ======
  //=== <set default image> ===
  //generating canvas tag.
  cvsDiv=f('div','div'+cvsId,fmId);
  setCss(cvsDiv,'auto','fixed');
  for(var i=0;i<5;i+=1){
    cvs[i]=f('canvas',i+cvsId,cvsDiv.id),cvs[i].width=9,cvs[i].height=9;
    setCss(cvs[i],i,'absolute');
  }
  setImg2Cvs(cvs[0],tgtTg[0]);
  cW=cvs[0].width,cH=cvs[0].height;
  for(var i=1;i<cvs.length;i+=1){cvs[i].width=cW,cvs[i].height=cH;}
  idCvs=f('p','CVSID'+r9,fmId).innerHTML='canvas id: '+cvs[3].id;
  WH=f('p','CVS_WH'+r9,fmId),WH.innerHTML='Size: W x H = '+cvs[0].width+' x '+cvs[0].height+' px';
  //set parameters for canvas.
  pDiv=f('div','prm'+cvsId,fmId);
  for(var i=0;i<3;i+=1){
    cvsPLb[i]=f('label','lbl'+i+pDiv.id,pDiv.id);
  }
  /*Target area*/
  cvsPLb[0].innerHTML='<br>Target width(x0,w):';
  /*sampling interval*/
  cvsPLb[1].innerHTML='<br>Sampling interval(>1):';
  /*true range of values*/
  cvsPLb[2].innerHTML='<br>Range of values(v0,v):';
  for(var i=0;i<cvsPLb.length;i+=1){
    cvsP[i]=f('input',i+pDiv.id,cvsPLb[i].id),cvsP[i].type=['text','number','text'][i];
  }
  cvsP[1].min=2,cvsP[1].step=1;
  deftV=getDefault(cvs[0]);
  for(var i=0;i<cvsP.length;i+=1){
    cvsP[i].value=deftV[i];
  }
  //target area on canvas
  getCArea(cvs[1],cvsP[0].value.split(','),'rgba(255,0,0,0.2)');
  //=== </set default image> ===
  //<image select event>
  slct.addEventListener('change',function(){
    //clearing all canvas
    for(var i=0;i<cvs.length;i+=1){
      clrCs(cvs[i]);
    }
    setImg2Cvs(cvs[0],tgtTg[this.value]);
    cW=cvs[0].width,cH=cvs[0].height;
    WH.innerHTML='Size: W x H = '+cW+' x '+cH+' px';
    for(var i=1;i<cvs.length;i+=1){
      cvs[i].width=cW,cvs[i].height=cH;}
    //set new default values
    for(var i=0;i<cvsP.length;i+=1){
      cvsP[i].value=getDefault(cvs[0])[i];}
    for(var i=0;i<cvsP.length;i+=1){
      cvsPV[i]=slf.document.getElementById(cvsP[i].id).value;}
    //draw target area on canvas.
    getCArea(cvs[1],cvsPV[0].split(','),'rgba(255,0,0,0.2)');
  },true);
  //</image select event>
  //<parameter change event>
  //target area change
  cvsP[0].addEventListener('change',function(){
    clrCs(cvs[1]),clrCs(cvs[2]);
    pV=this.value.split(',');
    getCArea(cvs[1],pV,'rgba(255,0,0,0.2)');
    cvsP[2].value=pV[0]+','+(+pV[0]+(+pV[1]));
  },true);
  //</parameter change event>
  //<draw event>
  cvs[4].addEventListener('mousedown',function(e){dr(e,cvs[3]);},true);
  cvs[4].addEventListener('mouseup',function(e){dr(e,cvs[3]);},true);
  cvs[4].addEventListener('mousemove',function(e){dr(e,cvs[3],'rgba(0,0,255,1)',2);},true);
  cvs[4].addEventListener('mouseout',function(e){dr(e,cvs[3],'rgba(0,0,255,1)',2);},true);
  //</draw event>
  //=== <bottun> ===
  clearB=f('input','clear'+BId,fmId),clearB.type='button',clearB.value='Clear image';
  splLB=f('input','splL'+BId,fmId),splLB.type='button',splLB.value='Show sampling line';
  clSpB=f('input','clSpl'+BId,fmId),clSpB.type='button',clSpB.value='Clear sampling line';
  cDrB=f('input','clDr'+BId,fmId),cDrB.type='button',cDrB.value='Clear drawing';
  splB=f('input','sampling'+BId,fmId),splB.type='button',splB.value='Run sampling';
  closeB=f('input','close'+BId,fmId),closeB.type='button',closeB.value='Close';
  clearB.addEventListener('click',function(){clrCs(cvs[0]);},true);
  clSpB.addEventListener('click',function(){clrCs(cvs[2]);},true);
  cDrB.addEventListener('click',function(){clrCs(cvs[3]);},true);
  closeB.addEventListener('click',function(){
    _div=slf.document.getElementById(divId),_r=_div.parentNode.removeChild(_div),_div=_r=null;
  },true);
  //=== showing sampling interval. ===
  splLB.addEventListener('click',function(){
    for(var i=0;i<cvsP.length;i+=1){
      cvsPV[i]=slf.document.getElementById(cvsP[i].id).value;}
    clrCs(cvs[2]),getSplL(cvs[2],cvsPV[0].split(','),cvsPV[1]);
  },true);
  //=== sampling from given canvas ===
  splB.addEventListener('click',function(){
    var R={};
    /*Target area*/
    a=slf.document.getElementById(cvsP[0].id).value.split(',');
    /*sampling interval*/
    iV=slf.document.getElementById(cvsP[1].id).value;
    /*script for worker*/
    spt=[
      /*it returns 1st index of A[j]>c or given value B; alpha value of rgba.*/
      'var f=function(A,c,B){var i=0,v=0,n=A.length,F=!0;while(F){F=!(A[3+4*i]>c);v=F?B:i;if(i<n-1){i+=1;}else{F=!1;}}return v;},',
      /*it returns an array composed of x in A, while A=[x0@f(x0), ..., x@f(x)];*/
      'g=function(A){var n=A.length,X,I=0,v=[];for(var i=0;i<n;i+=1){X=A[i].split(\'@\'),I=0;while(I<X[1]){v.push(X[0]),I+=1;}}return v;},',
      /*data of sample: s=[[s00, ... s0m], ..., [snm]]*/
      's=',gtImSpl(cvs[3].id,a,iV),',n=s.length,R=[];',
      /*eventlistener*/
      'this.addEventListener(\'message\',function(e){',
      'if(e.data[0]<1){for(var i=0;i<n;i+=1){R.push(i+\'@\'+f(s[i],0,',cvs[3].height,'));}',
      /*posted value: x0@f(x0), ..., x@f(x)*/
      's=n=null;this.postMessage([0,R.join()]);}',
      /*posted value: x0,x0, ..., x,x*/
      'else{this.postMessage([1,g(e.data[1].split(\',\')).join()]);this.close();}},true);'
    ].join('');
    //generation of worker
    b=new Blob([spt],{type:'text/javascript'});
    U=slf.URL.createObjectURL(b);
    W=new Worker(U),slf.URL.revokeObjectURL(U),b=null;
    //eventlisteners with worker
    W.addEventListener('message',function(e){
      if(e.data[0]<1){
        //d=[x0@f(x0), ..., x@f(x)];
        d=e.data[1].split(','),clrCs(cvs[4]);
        for(var i=0;i<cvsP.length;i+=1){
          v[i]=slf.document.getElementById(cvsP[i].id).value.split(',');}
        R=drGrh(d,v,cvs[4].id);
        W.postMessage([1,R['x@f(x)']]);
      }else{
        R.Rnd=e.data[1];
        //result output
        t='/*'+slf.Date().replace(/\s/g,'_')+',Sampling interval:'+slf.document.getElementById(cvsP[1].id).value+','+slf.document.getElementById(WH.id).innerHTML+'*/\n';
        for(el in R){t+=el+':'+R[el]+'\n'}
        slf.document.getElementById(resId).value+=t,t=R=null;
      }},true);
    //error in worker
    W.addEventListener('error',function(e){console.log(e.message),W.terminate();},true);
    W.postMessage([0]);
  },true);
  //=== </bottun> ===
  //=== <result> ===
  resLbl=f('label',resId+'label',fResId),resLbl.innerHTML='Result:';
  resIp=f('textarea',resId,resLbl.id),resIp.name='R';
  br01=f('br','br01'+r9,fResId);
  rstB=f('input','reset'+BId,fResId),rstB.type='button',rstB.value='Clear result';
  rstB.addEventListener('click',function(){resIp.value='';},true);
  //email address for output
  adLbl=f('label',adrsId+'label', fResId),adLbl.innerHTML='<br>Email address:';
  adIp=f('input',adrsId,adLbl.id),adIp.type='email',adIp.value='123.ex@qwerty.com';
  sbB=f('input','submit'+BId,fResId),sbB.type='submit',sbB.value='Output as email';
  //<address change event>
  adIp.addEventListener('change',function(){
    slf.document.getElementById(fResId).action='mailto:'+this.value+'?subject='+slf.document.getElementsByTagName('title')[0].innerHTML;
  },true);
  //</address change event>
  //=== </result> ===
//============================================================================
}