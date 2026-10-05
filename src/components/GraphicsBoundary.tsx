import { Component, type ReactNode } from 'react';
export class GraphicsBoundary extends Component<{children:ReactNode;onFailure:()=>void;fallback?:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?this.props.fallback??null:this.props.children;}
}
