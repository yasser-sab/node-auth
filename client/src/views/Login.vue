<template>
    <section>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{errorMessage}}
        </div>
        <h1>login</h1>
        <img v-if="loggingIn" class="loading" src="../assets/Infinity-0.9s-201px.svg" alt="loading"/>
        <form v-if="!loggingIn" @submit.prevent="login()">
            <div class="form-group">
                <label for="username" class="form-label">username : </label>
                <input v-model="user.username" type="text" class="form-control" id="username">
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input v-model="user.password" type="password" class="form-control" id="password">
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary mt-5">login</button>
            </div>
        </form>
    </section>
</template>

<script>
    import joi from 'joi';

    const LOGIN_URL='http://localhost:5000/auth/login';

    const schema =  joi.object().keys({
        username:joi.string().regex(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
        password:joi.string().min(6).trim().required(),
    });

    export default{
        data:()=>({
            loggingIn:false,
            errorMessage:'',
            user:{
                username:"",
                password:""
            }
        }),
        watch:{
            user:{
                handler(){
                    this.errorMessage='';
                },
                deep:true
            }
        },
        methods:{
            isValid(){
                const result = schema.validate(this.user);
                const error = result.error;

                if (!error){
                    return true;
                }

                this.errorMessage=error.message;
                return false;
            },
            login(){

                if(this.isValid()){
                    this.loggingIn=true;
                    const body={
                        username:this.user.username,
                        password:this.user.password
                    };
                    fetch(LOGIN_URL,{
                        method:'POST',
                        body:JSON.stringify(body),
                        headers:{
                            'content-type':'application/json'
                        }
                    }).then(response=>{
                       if(response.ok){
                           return response.json();
                       }else{
                           return response.json().then(err=>{
                               throw new Error(err.message);
                           });
                       }
                   }).then(result=>{
                       localStorage.token=result.token;
                        setTimeout(()=>{

                           this.loggingIn=false;
                           this.$router.push('/dashboard');
                        },1000);

                   }).catch(err=>{
                       setTimeout(()=>{
                           this.loggingIn=false;
                           this.errorMessage=err.message;
                       },1000);

                   });
                }
            }
        }
    };
</script>

<style>
</style>