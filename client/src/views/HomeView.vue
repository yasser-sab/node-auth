<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1>Auth</h1>
      <p>press sign up to register</p>
      <p>
        <router-link
          class="btn btn-primary btn-lg"
          :to="{name:'signup'}"
          >Sign up
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>

export default {

}
</script>
<style>

  .jumbotron{
    background-color: rgba(0,0,0,.1);
    padding: 1rem 0;
  }

  .btn-lg {
    margin-top: 5rem;
  }

</style>