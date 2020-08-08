import React , {Component} from 'react';
import {Formik,Form,Field,ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { baseUrl } from './baseUrl';
import {  toast } from 'react-toastify';

class ReusableForm extends Component{

    constructor(props){
        super(props);

        this.state={
            firstName: '',
            lastName: '',
            solved:0,
            ds:0,
            algo:0,
            python:0,
            java:0,
            react:0,
            node:0,
            cpp:0,
            c:0,
            isForwared:false,
            isEdit:false
        }
    }

  async  UNSAFE_componentWillMount()
    {

        
        if(this.props.details)
        {
           // console.log(this.props.details);

           

            this.props.details.expert.forEach(async (item,index)=>{
                if(item.subject==='Data Structures')
                   await this.setState({
                        ds:item.rating
                    });
                else if(item.subject==='Java')
                await this.setState({
                    java:item.rating
                });
                else if(item.subject==='Algorithms')
                await this.setState({
                    algo:item.rating
                });
                else if(item.subject==='Python')
                await this.setState({
                    python:item.rating
                });
                else if(item.subject==='C')
                await this.setState({
                    c:item.rating
                });
                else if(item.subject==='C++')
                await this.setState({
                    cpp:item.rating
                });
                else if(item.subject==='React JS')
                await this.setState({
                    react:item.rating
                });
                else if(item.subject==='Node JS')
                await this.setState({
                    node:item.rating
                });
            })

            await this.setState({
                firstName:this.props.details.first_name,
                lastName:this.props.details.last_name,
                solved:this.props.details.solved,
                isEdit:true
            });

           // console.log(this.state);
        }
    }

    postDetails=async (fields)=>{

       // console.log(fields);

        let temp={
            first_name:fields.firstName,
            last_name:fields.lastName,
            solved:fields.solved,
            total_votes:fields.total_votes ? fields.total_votes : 0,
            expert:[
                {
                    subject:"Data Structures",
                    rating:fields.ds
                },
                {
                    subject:"Algorithms",
                    rating:fields.algo
                },
                {
                    subject:"Python",
                    rating:fields.python
                },{
                    subject:"Java",
                    rating:fields.java
                },{
                    subject:"C",
                    rating:fields.c
                },{
                    subject:"C++",
                    rating:fields.cpp
                },{
                    subject:"React JS",
                    rating:fields.react
                },{
                    subject:"Node JS",
                    rating:fields.node
                }

            ]
        }

        try{
            let res;
            if(this.state.isEdit)
            {
                temp._id=this.props.details._id;

              //  console.log(temp);
                res= await fetch(baseUrl+'/details',{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${fields.code}`
                    },
                    credentials:'same-origin',
                    body:JSON.stringify(temp)
                });
            }
            else
            {
                res=await fetch(baseUrl+'/details',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${fields.code}`
                    },
                    credentials:'same-origin',
                    body:JSON.stringify(temp)
                });
            }

            if(res.ok)
            {
                let data=await res.json();
               // console.log(data);

                if(data.status===0)
                {
                    if(data.code)
                    {
                        toast.success(`Candidate Added Successfully !! Candidate code is ${data.code}`,{
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
                    toast.success(`Candidate Details Updated Successfully !!`,{
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
                    toast.error('Couldn\'t update candidate details ! Please try again .',{
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
            else
            {
                let data=await res.json();

               // console.log(data);

                if(data.status===1)
                {
                    toast.error(`You are not authorized to perform this operation !!`,{
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
            this.props.onComplete();
        }
        catch(error){
            console.log(error);
        }
        

    }

    render(){

        if(this.state.isForwared)
        {
          return(  <Formik 
                initialValues={{
                    code:'',
                }}
                validationSchema={
                    Yup.object().shape({
                        code:Yup.string()
                        .required('Admin password is required !')
                    })}
                    onSubmit={fields => {
                        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4));

                        this.postDetails(fields);

                    }}
                    render={({errors,status,touched})=>(
                        <Form>
                        <div className="form-group">
                        <label htmlFor="code"> {this.state.isEdit ? 'ADMIN/CANDIDATE CODE':'ADMIN CODE'} </label>
                        <Field name="code" type="password" className={'form-control' + (errors.code && touched.code ? ' is-invalid' : '')} />
                        <ErrorMessage name="code" component="div" className="invalid-feedback" />
                        </div> 
                        <div className="d-flex justify-content-center">
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">{this.state.isEdit ? 'Update' : 'Register'}</button>
                            <button type="reset" className="btn btn-secondary">Reset</button>
                        </div>
                        </div>
                        </Form>
                    )}
                />
            )
        }
    else
        return (
            <Formik
                initialValues={{
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    solved:this.state.solved,
                    ds:this.state.ds,
                    algo:this.state.algo,
                    python:this.state.python,
                    java:this.state.java,
                    react:this.state.react,
                    node:this.state.node,
                    cpp:this.state.cpp,
                    c:this.state.c

                }}
                validationSchema={Yup.object().shape({
                    firstName: Yup.string()
                        .required('First Name is required'),
                    lastName:Yup.string(),
                    solved:Yup.number(),
                    ds:Yup.number(),
                    algo:Yup.number(),
                    java:Yup.number(),
                    python:Yup.number(),
                    react:Yup.number(),
                    node:Yup.number(),
                    cpp:Yup.number(),
                    c:Yup.number()
                })}
                onSubmit={fields => {
                   // alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4))
                   if(fields.ds>5 || fields.ds<0||fields.algo>5 || fields.algo<0||fields.python>5 || fields.python<0||fields.java>5 || fields.java<0||fields.cpp>5 || fields.cpp<0||fields.c>5 || fields.c<0||fields.react>5 || fields.react<0||fields.node>5 || fields.node<0)
                   {
                       toast.error('Rating must be between 1-5 !!',{
                        position:"top-center",
                        autoClose:5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                       });
                   }
                    else if(fields.solved<0)
                    {
                        toast.error('Number of challenges solved can\'t be less than 0 !!',{
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
                    this.setState({
                        isForwared:true
                    });
                }}
                render={({ errors, status, touched }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                            <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                            <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="solved"> No. of challenges solved </label>
                            <Field name="solved" type="number" className="form-control" min={0} />
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <h5>Experts In :-</h5>
                                <span>  <small> Rating between 1 to 5 </small> </span>

                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center">
                                      <label htmlFor="ds">  Data Structure </label>
                                    </div>
                                    <div className="col-6">
                                    <div className="form-group">
                                    <Field name="ds" type="number" className="form-control" min={0} max={5} />
                                    </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center">
                                        Algorithms
                                    </div>
                                    <div className="col-6">
                                    <div className="form-group">
                                    <Field name="algo" type="number" className="form-control" min={0} max={5} />
                                    </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center">
                                        C
                                    </div>
                                    <div className="col-6">
                                    <div className="form-group">
                                    <Field name="c" type="number" className="form-control" min={0} max={5} />
                                    </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center">
                                        Python
                                    </div>
                                    <div className="col-6">
                                    <div className="form-group">
                                    <Field name="python" type="number" className="form-control" min={0} max={5} />
                                    </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center">
                                        Java
                                    </div>
                                    <div className="col-6">
                                    <div className="form-group">
                                    <Field name="java" type="number" className="form-control" min={0} max={5} />
                                    </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center">
                                        c++
                                    </div>
                                    <div className="col-6">
                                    <div className="form-group">
                                    <Field name="cpp" type="number" className="form-control" min={0} max={5} />
                                    </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center">
                                       React js
                                    </div>
                                    <div className="col-6">
                                    <div className="form-group">
                                    <Field name="react" type="number" className="form-control" min={0} max={5} />
                                    </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center">
                                       Node js
                                    </div>
                                    <div className="col-6">
                                    <div className="form-group">
                                    <Field name="node" type="number" className="form-control" min={0} max={5} />
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2"> {this.state.isEdit ? 'Update' : 'Register'} </button>
                            <button type="reset" className="btn btn-secondary">Reset</button>
                        </div>
                        </div>
                    </Form>
                )}
            />
        )

    }
}

export default ReusableForm;