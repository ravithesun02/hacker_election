import React ,{Component} from 'react';
import { baseUrl } from './baseUrl';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { Button, Card, CardBody, ButtonGroup , Modal,ModalHeader,ModalBody} from 'reactstrap';
import StarRatingComponent from 'react-star-rating-component';
import ReusableForm from './ReusableForm';
import {Formik,Form,Field,ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {  toast } from 'react-toastify';

var formprops;

class HackerList extends Component{

    constructor(props){
        super(props);
        this.state={
            userList:[],
            isModalOpen:false,
            isDelete:false,
            deleteId:null

        }
       // this.toggleEditModal=this.toggleEditModal.bind(this);
    }


    fetchUserList= async ()=>{
        try{
            let res=await fetch(baseUrl+'/details');
            if(res.ok)
            {
                let data=await res.json();

                this.setState({
                    userList:data.list
                });


            }
        }
        catch(error){
            console.log(error);
        }
    }

    toggleEditModal=async (item)=>{
       // console.log(item);
        formprops=item;
        await this.setState({
            isModalOpen:!this.state.isModalOpen
        });
    }

    toggleDeleteModal=async (id)=>{

        this.setState({
            deleteId:id
        });

        await this.setState({
            isDelete:!this.state.isDelete
        });

    }

    deleteCandidate=async (fields)=>{
       // console.log(fields);

        let temp={
            _id:this.state.deleteId
        };

        try{
            let res=await fetch(baseUrl+'/details',{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${fields.code}`
                },
                credentials:'same-origin',
                body:JSON.stringify(temp)
            });
          //  console.log(res);
            if(res.ok)
            {
                let data=await res.json();
               

                if(data.status===0)
                {
                    toast.success(`Candidate deleted Successfully`,{
                        position:"top-center",
                        autoClose:5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }

                this.fetchUserList();

                //console.log(data);
            }
            else
            {
                let data=await res.json();

              //  console.log(data);

                if(data.status===1)
                {
                    toast.error(`You are not authorized to delete !!`,{
                        position:"top-center",
                        autoClose:5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                else
                {
                    toast.error(`Internal Server error !!`,{
                        position:"top-center",
                        autoClose:5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }
            this.setState({
                isDelete:false
            });
        }
        catch(error){
            console.log(error);
        }
    }

   async componentDidMount(){
        await this.fetchUserList();

       // console.log(this.state.userList);
    }

    renderExperts=(item)=>{
      let temp=  item.expert.map((element,index)=>{
            return (
                <div key={element._id} className="mt-2">
                    <div className="d-flex">
                        <div className="mr-3 pr-3">
                            {element.subject}
                        </div>
                        <div className="ml-3 pl-3">
                            <StarRatingComponent name="rate1" starCount={5} value={element.rating} />
                        </div>
                    </div>
                </div>
            )
        })

        return temp;
    }

    voteApiCall=async (item)=>{

        try{
            let res=await fetch(baseUrl,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'same-origin',
                body:JSON.stringify(item)
            });

            if(res.ok)
            {
               // console.log(res);
                let data=await res.json();

                if(data.status===0)
                {
                   
                    document.cookie=`_id=${item._id}`;
                    toast.success(`You have voted for ${item.first_name}`,{
                        position:"top-center",
                        autoClose:5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    this.fetchUserList();
                }
                else if(data.status===1)
                {
                    
                    toast.info(`You have already voted for ${data.first}`,{
                        position:"top-center",
                        autoClose:5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
                else
                {
                    toast.error('Voting error ! Try again later',{
                        position:"top-center",
                        autoClose:5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            }
        }
        catch(erro){
            console.log(erro);
        }

    }

     voteFor=async (item)=>{

      // console.log(document.cookie.includes('voted'));

       if(document.cookie.includes('_id'))
       {
           let s=document.cookie.split(' ');

           s.forEach( async (ele,index)=>{
               if(ele.includes('_id'))
               {
                    let ans=ele.split('=');
                    let temp=false;
                    this.state.userList.forEach((element,index)=>{
                        if(element._id===ans[1])
                        {
                            temp=true;
                            toast.info(`You have already voted for ${element.first_name.toUpperCase()}`,{
                                position:"top-center",
                                autoClose:5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            })
                        }
                    });

                    if(!temp)
                    {
                        // document.cookie='_id=;';
                        // console.log(document.cookie);
                       await this.voteApiCall(item);
                    }

                   // console.log(ans);
                    

               }
           })
       }
else
      await this.voteApiCall(item);
        
    }


    render(){


  const closeBtn = <button className="close" onClick={this.toggleEditModal}>&times;</button>;
  const deleteCloseBtn=<button className="close" onClick={this.toggleDeleteModal}>&times;</button>;

        const renderList=this.state.userList.map((item,index)=>{
            return (
                <AccordionItem key={item._id}>
                <AccordionItemHeading>
                    <AccordionItemButton style={{display:'flex',alignItems:'center'}}> 
                    <div style={{justifyContent:"space-between",display:'flex',width:'100%'}}>
                        <div>
                        {`${item.first_name.toUpperCase()} ${item.last_name.toUpperCase()}`}
                        </div>
                        <div>
                            Total votes:- {item.total_votes}
                        </div>
                    </div>  
                    </AccordionItemButton>
                   
                </AccordionItemHeading>
                <AccordionItemPanel>
                <Card>
                    <CardBody style={{color:'black'}}>
                    <div className="row d-flex justify-content-center">

                    <div className="voteBtn">
                        <Button title="Vote" onClick={()=>{this.voteFor(item)}}  outline style={{backgroundColor:'orange',color:'black'}}>Vote</Button>
                    </div>

                    <div className="small">
                       <small> You can vote only one Candidate !! </small>
                    </div>

                    <h2>  Name :- {`${item.first_name.toUpperCase()} ${item.last_name.toUpperCase()}`}
                    </h2>
                    <div className="btn-gp">
                        <ButtonGroup>
                            <Button className="editBtn" title="Candidate / Admin only !!" onClick={()=>this.toggleEditModal(item)} >
                                <img src="assests/images/dark-pencil.svg" alt="edit"/>
                            </Button>
                            <Button className="editBtn" title="Admin only !!" onClick={()=>this.toggleDeleteModal(item._id)}>
                                <img src="assests/images/black-delete.svg" width="20" alt="delete"/>
                            </Button>
                         
                        </ButtonGroup>
                    </div>
                    </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-6 d-flex justify-content-center align-items-center" style={{flexDirection:'column'}}>
                                    <div className="mt-2">
                                        Total Votes :- {item.total_votes}
                                    </div>
                                    <div className="mt-2">
                                        No. of challenge solved :- {item.solved}
                                    </div>
                                </div>

                                <div className="col-6 d-flex justify-content-center align-items-center" style={{flexDirection:'column'}}>
                                   <h4>Experts In :-</h4>

                                   {this.renderExperts(item)}

                                </div>

                            </div>
                        </div>
                    </CardBody>
                </Card>
                </AccordionItemPanel>
            </AccordionItem>
            )
        })

        return(
           <div className="container-fluid pt-3">
              <div className="row mt-2">
                <div className="col-12">
                    <Accordion allowZeroExpanded>
                        {renderList}
                    </Accordion>
                </div>
              </div>
              <Modal isOpen={this.state.isModalOpen} size="lg" centered>
              <ModalHeader style={{color:'black'}} close={closeBtn}>Update Candidate Profile</ModalHeader>
              <ModalBody style={{color:'black'}}>
                  <ReusableForm details={formprops} onComplete={()=>{this.toggleEditModal();this.fetchUserList();}} />
              </ModalBody>
              </Modal>
              <Modal isOpen={this.state.isDelete} size="lg" centered>
              <ModalHeader style={{color:'black'}} close={deleteCloseBtn}>Delete Candidate Profile</ModalHeader>
              <ModalBody style={{color:'black'}}>
              <Formik 
              initialValues={{
                  code:'',
              }}
              validationSchema={
                  Yup.object().shape({
                      code:Yup.string()
                      .required('Admin password is required !')
                  })}
                  onSubmit={fields => {
                     // alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4));

                    this.deleteCandidate(fields);
                  }}
                  render={({errors,status,touched})=>(
                      <Form>
                      <div className="form-group">
                      <label htmlFor="code">ADMIN CODE</label>
                      <Field name="code" type="password" className={'form-control' + (errors.code && touched.code ? ' is-invalid' : '')} />
                      <ErrorMessage name="code" component="div" className="invalid-feedback" />
                      </div> 
                      <div className="d-flex justify-content-center">
                      <div className="form-group">
                          <button type="submit" className="btn btn-primary mr-2">Delete</button>
                          <button type="reset" className="btn btn-secondary">Reset</button>
                      </div>
                      </div>
                      </Form>
                  )}
              />
              </ModalBody>
              </Modal>
           </div>
        )
    }

}

export default HackerList;