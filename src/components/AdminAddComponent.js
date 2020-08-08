import React ,{Component} from 'react';
import { Button, Modal ,ModalBody,ModalHeader} from 'reactstrap';
import ReusableForm from './ReusableForm';


class AddCandidate extends Component{

    constructor(props){
        super(props);

        this.state={
            isModalOpen:false
        };
    }

    toggleModal=()=>{
        this.setState({
            isModalOpen:!this.state.isModalOpen
        });

        this.props.onAdd();
    }

    render(){


  const closeBtn = <button className="close" onClick={this.toggleModal}>&times;</button>;

        return(
            <div>
                <div className="container pt-2">
                    <div className="row mt-2">
                        <div className="col-md-9 col-sm-9 d-flex justify-content-center">
                            <h2> Hackers Election </h2>
                        </div>
                        <div className="col-md-3 col-sm-3 d-flex justify-content-center">
                            <Button onClick= {this.toggleModal} style={{backgroundColor:'orange'}}> 
                            <img src="assests/images/blue-plus.svg" width="20" alt="plus"/> {' '}
                            Add Candidate</Button>
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.isModalOpen} size="lg" centered>
                <ModalHeader style={{color:'black'}} close={closeBtn}>Add Candidate Profile</ModalHeader>
                <ModalBody style={{color:'black'}}>
                    <ReusableForm onComplete={()=>{this.toggleModal()}}/>
                </ModalBody>
                </Modal>
            </div>
        )
    }

}

export default AddCandidate;