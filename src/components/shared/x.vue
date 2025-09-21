<template>
  

  <!-- المودال -->
  <div
    class="modal fade"
    id="unitDetailsModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content p-3">
        <!-- Header -->
        <div class="modal-header border-0 pb-0">
          <h5>Unit Details</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <ModalHeader />

        <!-- Body -->
        <div class="modal-body">
          <!-- Tabs -->
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a
                class="nav-link active"
                data-bs-toggle="tab"
                href="#info"
              >
                Info
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-bs-toggle="tab"
                href="#devices"
              >
                Devices
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-bs-toggle="tab"
                href="#drivers"
              >
                Drivers
              </a>
            </li>
          </ul>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Info Tab -->
            <div class="tab-pane fade show active" id="info">
              <div class="row mb-2">
                <div class="col-6">
                  <strong>Vehicle Name:</strong> Vehicle 3
                </div>
                <div class="col-6">
                  <strong>Fuel Type:</strong> Petrol
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-6">
                  <strong>Tank Capacity:</strong> 300
                </div>
                <div class="col-6">
                  <strong>Vehicle Model:</strong> 2023
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-6">
                  <strong>Chassis Serial Number:</strong> 1HGBH41JXMN109186
                </div>
                <div class="col-6">
                  <strong>Engine Serial Number:</strong> 49B - 02358
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-6">
                  <strong>Oil Consumption (liter/km):</strong> 300
                </div>
                <div class="col-6">
                  <strong>Vehicle Model:</strong> 2023
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-6">
                  <strong>License Expiry At:</strong> 2023-07-29
                </div>
                <div class="col-6">
                  <strong>Insurance Expiry At:</strong> 2023-07-29
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-6">
                  <strong>Vehicle Color:</strong>
                </div>
                <div class="col-6">
                  <strong>Vehicle Icon:</strong> Car
                </div>
              </div>

              <div class="mt-3">
                <strong>Tags:</strong>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <span class="badge bg-primary">First Tag</span>
                  <span class="badge bg-secondary">Tag Two</span>
                  <span class="badge bg-info">
                    Another Tag With Long Text Here
                  </span>
                </div>
              </div>
            </div>

            <!-- Devices Tab -->
            <div class="tab-pane fade" id="devices">
              <p>No devices assigned.</p>
            </div>

            <!-- Drivers Tab -->
            <div class="tab-pane fade" id="drivers">
              <p>No drivers assigned.</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
         <div class="modal-footer">
          <button
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button class="btn btn-primary">Unit Profile →</button>
        </div>
      
      </div>
    </div>
  </div>
</template>

<script setup>
import ModalHeader from '../../../components/shared/UnitDetailsModalHeader.vue'
</script>

<style scoped>
.badge {
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
}
</style>
