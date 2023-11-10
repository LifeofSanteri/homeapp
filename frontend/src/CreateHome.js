import React from "react";
import axios from "axios";

function CreateHome() {

return (
<div className="d-flex justify-content-center align-items-center vh-100 bg-black">
<div
title="Kotiapp"
className="border w-25 rounded d-flex flex-column justify-content-center h-75 bg-white"
>
<h4 className="text-center">Tervetuloa</h4>
<h1 className="text-center">Kotiapp</h1>
<div className="d-flex justify-content-center align-items-center bg-white p-3 m-3">
<div className="bg-white p-3 rounded w-100">
<div className="mb-5">

<label htmlFor="email" className="visually-hidden">Kodin nimi</label>
<input
type="name"
placeholder="Anna kodille nimi"
name="name"
id="name"
className="form-control rounded-pill"
/>

</div>
<div className="mb-3">
<button type="button" className="btn btn-dark w-100 rounded-pill" onClick={''}>
<strong>Luo koti</strong>
</button>
</div>

</div>
</div>
</div>
</div>
);
}

export default CreateHome;



