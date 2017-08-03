import React, { Component } from 'react';
import { BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine, ReferenceDot,
  XAxis, YAxis, Legend, ErrorBar, LabelList,Layer,ResponsiveContainer } from 'recharts';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
import _ from 'lodash';
import gradient from 'gradient-color';


const renderLabelContent = (props) => {
  const { value, percent, x, y, midAngle,dataKey,width,height } = props;
  let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        widthc = w.innerWidth || e.clientWidth || g.clientWidth,
        heightc = w.innerHeight|| e.clientHeight|| g.clientHeight,
        fontSize;
    if(heightc > widthc)
      fontSize="11px";
    else
      fontSize="11px";
  return (
    <g className="custom-label" transform={`translate(${x+width+20}, ${y+height/2}) rotate(-90)`} textAnchor={ (midAngle < -90 || midAngle >= 90) ? 'end' : 'start'}>
      <text x={0} y={0} style={{fontSize:fontSize,fontFamily:"Helvetica"}}>{`${dataKey}`}</text>
      <line x1={0} y1={-15} x2={0} y2={-20} strokeWidth="0.5" stroke="black"></line>
    </g>
  );
};

const CustomTooltip = (props) => {
    const { mouseX,mouseY, payload, label,key,tooltipData,name,value,befData } = props.vals;
    return (
        <div style={{backgroundColor:"white",borderBottom:"1px solid rgba(0,0,0,0.1)",boxShadow:"0px 1px 1px 1px rgba(0,0,0,0.2)",borderRadius:"2px",pointerEvents:'none',padding:"3px",top:mouseY,left:mouseX,width:"150px",height:"80px",position:"absolute"}}>
          <table cellSpacing="0px" style={{backgroundColor:"white",width:"150px",height:"80px"}}>
            <tbody>
              <tr>
                <th  colSpan={2} style={{backgroundColor:"white",borderBottom:"1px solid rgba(0,0,0,0.1)",textAlign:"left",fontSize:"12px",fontFamily:"Helvetica"}}>{key}</th>
              </tr>
              <tr>
                <td style={{paddingLeft:"5px",backgroundColor:"white",textAlign:"left",width:"50%",fontSize:"12px",fontFamily:"Helvetica"}}>In Numbers</td>
                <th style={{paddingRight:"5px",backgroundColor:"white",textAlign:"right",fontSize:"12px",width:"50%",fontFamily:"Helvetica"}}>{tooltipData}%</th>
              </tr>
              <tr>
                <td style={{paddingLeft:"5px",backgroundColor:"white",textAlign:"left",width:"50%",fontSize:"12px",fontFamily:"Helvetica"}}>In Percent</td>
                <th style={{paddingRight:"5px",backgroundColor:"white",textAlign:"right",fontSize:"12px",width:"50%",fontFamily:"Helvetica"}}>{befData[key]}</th>
              </tr>
            </tbody>
          </table>
        </div>
    );
}


export default class PBarChart extends Component {

  constructor(props){
    super(props);
    this.state={
      active:false
    }
  }
  static displayName = 'BarChartDemo';

  handleMouseMove = (props,index,key,e)=>{
    let mouseX=e.clientX;
    let mouseY=e.clientY;
    let bar = document.getElementById(key);
    this.setState({
      active:true,
      key:key,
      tooltipData:props[key],
      bar:bar,
      mouseX:mouseX,
      mouseY:mouseY
    });

  }
  handleMouseLeave = ()=>{
    this.setState({
      active:false
    });
  }
  handleChangeData = () => {
    this.setState(() => _.mapValues(initilaState, changeNumberOfData));
  };

  componentWillMount(){
    let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth,
        height = w.innerHeight|| e.clientHeight|| g.clientHeight,
        fontSize;
    if(height > width)
      fontSize="12px";
    else
      fontSize="12px";
    width = height > width ? window.innerWidth-20 : window.innerHeight-20;
    let dataObj = this.props.data;
    let color = gradient([
      '#255AEE',
      '#9DD2FF'
    ], dataObj.length);
    height = 100;
    this.setState({
      height:height,
      width:width,
      fontSize:fontSize,
      color:color
    })
    let dat = {};
    let keys = Object.keys(dataObj[0]);
    dat["name"]=keys[0];
    dat["value"]=keys[1];
    dataObj.forEach((val)=>{
      dat[val[keys[0]]]=val[keys[1]];
    });
    let data=[];
    let back=JSON.parse(JSON.stringify(dat));
    data.push(dat);
    this.setState({
      befData:back
    })
    let total = Object.keys( data[0] )
                .reduce( function( sum, key ){
                  if(key === "name"|| key === "value" ) return sum;
                  return sum + parseFloat( data[0][key] );
                }, 0 );


    Object.keys( data[0] )
                .forEach(function( key,index){
                  if(key === "name"|| key === "value") return;
                  data[0][key] = parseFloat(((data[0][key]*100)/total).toFixed(1));
              });

    data[0] = Object.keys(data[0]).filter((key)=> key !== "name" && key !== "value").sort((a, b) => {
                        return data[0][b] - data[0][a] 
                    }).reduce((prev, curr, i) => {
                        prev[curr] = data[0][curr]
                        return prev
                    }, {});
    this.setState({
      total:total,
      data:data,
      name:keys[0],
      value:keys[1]
    })
  }

  componentDidMount(){
    let bars=Array.from(document.getElementsByClassName('recharts-bar'));
    bars.forEach((bar)=>{
      let check = bar.querySelector(".recharts-bar-rectangles").getBoundingClientRect().width;
      let text = bar.querySelector(".custom-label text");
      let label = bar.querySelector(".recharts-text.recharts-label");
      console.log(label);
      let check2 = label.getBoundingClientRect().width;;
      let comp = text.getBoundingClientRect().width;
      text.setAttribute('x',-comp/2);
      if(comp > check ){
        text.style.fill="none";
        bar.querySelector(".custom-label line").style.stroke="none";
      }
      if(check2 > check-6){
        label.style.fill="none";
      }
    })
  }

  handleBarAnimationStart = () => {
    console.log('Animation start');
  };

  handleBarAnimationEnd = () => {
    console.log('Animation end');
  };

  render() {
    const { data } = this.state;
    return (
      <div className="bar-charts">
        <div className="bar-chart-wrapper" style={{width:0,height:0}}>
            <BarChart width={this.state.height} height={this.state.width} maxHeight={500} maxWidth={100} data={data} horizontal={true} margin={{ top: 85, right: 35, bottom: -5, left: 5 }}>
              {
                Object.keys(data[0]).map((key,index)=>{
                  if(key === 'name' || key === 'value') return;
                  return(
                      <Bar stackId="0" key={key} dataKey={key} fill={this.state.color[index]} isAnimationActive = {false} label={renderLabelContent} onMouseLeave={this.handleMouseLeave} onMouseMove={this.handleMouseMove}>
                        <LabelList dataKey={key} horizontal={true} className="custom" perc={true} style={{fontFamily:"Helvetica",fill:"white",fontSize:this.state.fontSize,pointerEvents:'none'}}/>
                      </Bar>
                  );
                })
              }
            </BarChart>
            {this.state.active ? <CustomTooltip vals={this.state}/> : null}
        </div>
      </div>
    );
  }
}

