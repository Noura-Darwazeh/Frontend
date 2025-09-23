<template>
  <div class="container-fluid h-100vh">
    <div class="row h-100">
      <!-- Left Side (Login Form) -->
      <div class="col-md-6 d-flex justify-content-center align-items-center bg-white h-100 leftSide"
        style="width: 40%;">
        <div class="w-30">
          <!-- Logo -->
          <div class="mb-5 mt-4 text-center">
            <img src="../../../assets/login/logo.svg" alt="logo" />
          </div>

          <h4 class="fw-bold mb-5 text-center">Welcome</h4>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" placeholder="name@email.com" />
          </div>

          <!-- Password -->
          <div class="mb-3 position-relative">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" placeholder="Enter password" />
            <a href="#" class="small position-absolute end-0 top-0 text-decoration-none text-primary">Forgot
              password?</a>
          </div>

          <!-- Remember me -->
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="remember" />
            <label class="form-check-label" for="remember">Remember me</label>
          </div>

          <!-- Login Button -->
          <div class="d-grid mb-3">
            <button class="btn btn-primary">Log in</button>
          </div>

          <p class="text-muted small text-secondary">
            By logging in, I agree to PITS
            <a class="text-primary" href="#">Terms of use</a> and
            <a class="text-primary" href="#">Privacy Policy</a>.
          </p>

          <!-- Footer -->
          <p class="text-muted small mt-5 text-secondary text-center">
            &copy; 2025 PITS. All rights reserved.
          </p>
        </div>
      </div>

      <!-- Right Side (Image Slider) -->
      <div class="col-md-6 d-none d-md-block p-0 h-100 rightSide" style="width: 60%;">

        <div id="loginCarousel" class="carousel slide h-100" data-bs-ride="carousel" data-bs-interval="2000">
          <!-- hi -->
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="0" class="active"
              aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <!-- hi -->
          <div class="carousel-inner h-100 ">
            <!-- Slide 1 -->
            <div class="carousel-item h-100 active">
              <img src="https://images.pexels.com/photos/273961/pexels-photo-273961.jpeg" class="d-block w-100 h-100"
                style="object-fit: cover" alt="slide1" />

              <!-- الأزرار فوق يمين -->
              <div
                class="carousel-caption d-none d-md-flex justify-content-end align-items-start flex-column top-right-buttons">
                <div class="d-flex gap-2">
                  <SelectBtn option1="العربية" option2="English" />
                  <button class="btn btn-light btn-sm">Support</button>
                </div>
              </div>

              <!-- الكابشن أسفل يسار -->
              <div class="carousel-caption d-none d-md-flex flex-column bottom-left-caption">
                <h4 class="fw-bold fs-4 mb-3">Manage and run your fleet with ease!</h4>
              </div>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-item h-100">
              <img src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg" class="d-block w-100 h-100"
                style="object-fit: cover" alt="slide2" />

              <!-- الأزرار فوق يمين -->
              <div
                class="carousel-caption d-none d-md-flex justify-content-end align-items-start flex-column top-right-buttons">
                <div class="d-flex gap-2">
                  <SelectBtn option1="العربية" option2="English" />
                  <button class="btn btn-light btn-sm">Support</button>
                </div>
              </div>

              <!-- الكابشن أسفل يسار -->
              <div class="carousel-caption d-none d-md-flex flex-column bottom-left-caption">
                <h4 class="fw-bold fs-4 mb-3">Manage and run your fleet with ease!</h4>
              </div>
            </div>

            <!-- Slide 3 -->
            <div class="carousel-item h-100">
              <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg" class="d-block w-100 h-100"
                style="object-fit: cover" alt="slide3" />

              <!-- الأزرار فوق يمين -->
              <div
                class="carousel-caption d-none d-md-flex justify-content-end align-items-start flex-column top-right-buttons">
                <div class="d-flex gap-2">
                  <SelectBtn option1="العربية" option2="English" />
                  <button class="btn btn-light btn-sm">Support</button>
                </div>
              </div>

              <!-- الكابشن أسفل يسار -->
              <div class="carousel-caption d-none d-md-flex flex-column bottom-left-caption">
                <h4 class="fw-bold fs-4 mb-3">Manage and run your fleet with ease!</h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import SelectBtn from '../../../components/shared/Select.vue';
export default {
  components: {
    SelectBtn
  }
}
</script>

<style scoped>
.container-fluid,
.row {
  height: 100vh;
  margin: 0;
  padding: 5px;
}

.form-label {
  font-size: 16px;
  color: #778897;
}

.form-control {
  border: 1px solid #BDC8D1;
}

.form-control::placeholder {
  color: #BDC8D1;
  opacity: 1;
}

.text-primary {
  color: #0568A0 !important;
  font-weight: 500;
}

.form-check-label {
  color: #50606e;
  font-weight: 500;
}

.btn-primary {
  background-color: #0568A0;
  border: none;
}

.text-secondary {
  color: #A5B2BE !important;

  font-weight: 400;
}

.carousel-item img {
  height: 100vh;
  border-radius: 12px !important;

}

@media (max-width: 767.98px) {
  .leftSide {
    width: 100% !important;
  }

  .rightSide {
    display: none !important;

  }
}

.carousel-caption {
  bottom: 20px !important;
  left: 20px !important;

}

.carousel-caption .btn {
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
}

.top-right-buttons {
  position: absolute !important;
  top: 0px !important;
  right: 20px !important;
  bottom: auto !important;
  left: auto !important;
}

.top-right-buttons .btn {
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
}

.btn-light {
  background-color: #ffffff;
}

.bottom-left-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  top: auto;
  right: auto;
  flex-direction: column;
  align-items: flex-start;
  z-index: 10;
  color: #ffffff;
}


.carousel-indicators [data-bs-target] {
  width: 70px;
  height: 4px;
  border-radius: 0;
  background-color: #fff;
}

.carousel-indicators {
  justify-content: flex-start;
  margin-left: 20px;
  margin-right: auto;
}
</style>
