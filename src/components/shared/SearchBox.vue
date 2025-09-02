<template>
    <div class="search">
        <img src="../../assets/search.svg" alt="search" class="search-icon" />
        <input placeholder="Search"></input>
    </div>
</template>

<style>
.search {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 200px;
    border: 1px solid #D7DEE4;
    border-radius: 5PX;
    background-color: #FFFFFF;
    padding: 10px;
}

input {
    border: none;
}

::placeholder {
    color: #BDC8D1;
}
</style>