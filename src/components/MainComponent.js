import React , {Component} from 'react';
import AddCandidate from './AdminAddComponent';
import HackerList from './VoteListComponent';

class Main extends Component{

    constructor(props){
        super(props);
        this.child=React.createRef();
    }

    childFetch=()=>{
        this.child.current.fetchUserList();
    }

    render(){
        return(
            <div>
                <AddCandidate onAdd={()=>this.childFetch()}/>
                <HackerList ref={this.child}/>
            </div>
        )
    }
}

export default Main;