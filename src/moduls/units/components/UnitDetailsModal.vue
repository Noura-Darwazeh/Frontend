<template>

  <div class="modal fade" id="unitDetailsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content p-3">
        <!-- Header -->
        <div class="modal-header border-0 p-0">
          <h5>Unit Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <!-- <ModalHeader statusText="Connected" lastSynced="Last Synced 13:34:33 2023-06-24" infoColor="#778797"
          :checkIcon="CheckIcon" /> -->

        <ModalHeader statusText="Not Synced" lastSynced="Last Synced 13:34:33 2023-06-24" infoColor="#f7941d"
          :checkIcon="CheckIcon2" />

        <div class="modal-body">
          <!-- Tabs -->
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a class="nav-link " data-bs-toggle="tab" href="#info">
                Info
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex justify-content-center align-items-center  gap-2" data-bs-toggle="tab"
                href="#devices">
                Devices <span class="numOfDevices">3</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#drivers">
                Drivers
              </a>
            </li>
          </ul>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Info Tab -->
            <div class=" tab-pane fade show active" id="info">
              <div class="container-fluid">
                <div class="row info-row">
                  <div class="col-6">
                    <div class="label">Vehicle Name</div>
                    <div class="value">Vehicle 3</div>
                  </div>
                  <div class="col-6">
                    <div class="label">Fuel Type</div>
                    <div class="value">Petrol</div>
                  </div>
                </div>


                <div class="row info-row">
                  <div class="col-6">
                    <div class="label">Vehicle Name</div>
                    <div class="value">Vehicle 3</div>
                  </div>
                  <div class="col-6">
                    <div class="label">Fuel Type</div>
                    <div class="value">Petrol</div>
                  </div>
                </div>

                <div class="row info-row">
                  <div class="col-6">
                    <div class=" label">Vehicle Color</div>
                    <div class=" value">
                      <VehicleColor />
                    </div>
                  </div>

                  <div class="col-6">
                    <div class=" label">Vehicle Icon</div>
                    <div class=" value">Car</div>
                  </div>
                </div>


                <div class="row info-row">
                  <div class="col-6">

                    <div class=" label">Tags</div>
                    <div class="value">
                      <span class="tag">First Tag</span>
                      <span class="tag">Tag Two</span>
                      <span class="tag">Another Tag With Long Text Here</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Devices Tab -->
            <div class="tab-pane fade" id="devices">
              <div class="container-fluid">
                <div class="row info-row">
                  <div class="col-6">
                    <div class="label">Device Number</div>
                    <div class="value">412589999</div>
                  </div>
                  <div class="col-6">
                    <div class="label">Sim Number</div>
                    <div class="value">+972569805716</div>
                  </div>
                </div>


                <div class="row info-row">
                  <div class="col-6">
                    <div class="label">Provider Number</div>
                    <div class="value">1234</div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Drivers Tab -->
            <div class="tab-pane fade" id="drivers">
              <div class="d-flex justify-content-between">
                <p class="driverHistoryPar">DRIVER HISTORY</p>
                <a class="reportLink" href="">Full Report</a>

              </div>
              <div>
                <!-- <DriverHistory /> -->
                <DriverHistory :drivers="driversData" />

              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">
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
import VehicleColor from '../../../components/shared/VehicleColor.vue';
import CheckIcon from '../../../assets/record/check.svg';
import CheckIcon2 from '../../../assets/record/not.svg';
import DriverHistory from '../../../components/shared/DriverHistory.vue';

// import DriversTimeline from "./DriversTimeline.vue";
import { ref } from "vue";

const driversData = ref([
  {
    name: "Ahmed Saeed",
    current: true,
    start: "13:34:33 2023-06-24",
    end: null,
    status: "On Schedule",
  },
  {
    name: "Khaled Waleed",
    current: false,
    start: "13:34:33 2023-06-24",
    end: "13:34:33 2023-06-24",
    status: "Not On Schedule",
  },
  {
    name: "Adham Abed",
    current: false,
    start: "13:34:33 2023-06-24",
    end: "13:34:33 2023-06-24",
    status: "On Schedule",
  },
]);
</script>

<style scoped>
.badge {
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;

}

h5 {
  color: #778897;
 font-weight: 400;
  font-size: 16px;
}

.nav-tabs .nav-link {
  border: none;

  color: #778797;
  font-size: 14px;
  font-weight: 400;
}

.nav-tabs .nav-link.active {
  color: #0568A0;
  font-size: 14px;
  font-weight: 400;
  text-decoration: solid;
  border: none;
  border-bottom: 2px solid #0568A0;
  color: #0568A0;
  background: transparent;
}

.container-fluid {
  background-color: #f7fafc;
  border-radius: 12px;
  border: 1px solid #d7dee4 !important;
  margin: 0 !important;
  padding: 20px;

}

.label {
  color: #778797 !important;
  font-size: 16px;
  font-weight: 400;
}

.value {
  color: #21282e !important;
  font-size: 16px;
  font-weight: 500;
}

.info-row {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.info-row:last-child {
  border-bottom: none;
}

.numOfDevices {
  background-color: #0568a0;
  padding: 0 8px;
  border-radius: 12px;
  color: #ffffff;
}

.tag {
  display: inline-block;
  background-color: #0568a0;
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  margin: 2px;
}

.modal-footer {
  border-top: none;
}

button {
  color: #50606e;
  background-color: #ffffff;
  border: 1px solid #D7DEE4;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

}

.driverHistoryPar {
  color: #778897;
  font-size: 12px;
  font-weight: 500;
}

.reportLink {
  color: #0568A0;
  font-size: 14px;
  font-weight: 500;
}
</style>
