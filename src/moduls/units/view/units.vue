<script>
import '../components/UnitsHeader.vue'
import UnitRow from "../../../components/shared/UnitRow.vue";
import UnitsHeader from "../components/UnitsHeader.vue";

export default {
    name: "UnitsTable",
    props: {
        units: {
            type: Array,
            required: true
        }
    },
    components: { UnitRow, UnitsHeader },

    data() {
        return {
            units: [
                { id: 1, unit: 'Ruptela testing', driver: 'Sam Jameson', phone: '+972569805716', color: '#B92D2D', model: '2024', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 2, sim: '+972569805716' },
                { id: 2, unit: 'SDF', driver: 'Jenna Walker', phone: '+972569805716', color: 'black', model: '2023', lastUpdate: '13:34:33 2023-06-24', state: 'OFF', devices: 3, sim: '+972569805716' },
                { id: 3, unit: 'Active Vehicle 3', driver: 'Janni Olsson', phone: '+972569805716', color: 'white', model: '2021', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 1, sim: '+972569805716' },
                { id: 4, unit: 'Active Vehicle 2', driver: 'Thomas Pellewever', phone: '+972569805716', color: 'black', model: '2022', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 0, sim: '+972569805716' },
                { id: 5, unit: 'Active Vehicle 2', driver: 'Thomas Pellewever', phone: '+972569805716', color: '#ffffff', model: '2022', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 0, sim: '+972569805716' },
                { id: 6, unit: 'Active Vehicle 2', driver: 'Thomas Pellewever', phone: '+972569805716', color: '#BDC8D1', model: '2022', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 0, sim: '+972569805716' },
                { id: 7, unit: 'Active Vehicle 2', driver: 'Thomas Pellewever', phone: '+972569805716', color: '#BDC8D1', model: '2022', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 0, sim: '+972569805716' },
            ]
        }
    }
};


</script>
<template>
        <UnitsHeader />
        <table class="units-table">
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" />
                    </th>
                    <th>
                        <div class="th-with-icon">
                            UNIT
                            <img src="../../../assets/chevron-selector-vertical.svg" alt="icon" width="14"
                                height="14" />
                        </div>
                    </th>
                    <th>
                        <div class="th-with-icon">

                            DRIVER
                            <img src="../../../assets/chevron-selector-vertical.svg" alt="icon" width="14"
                                height="14" />
                        </div>
                    </th>
                    <th>PHONE</th>
                    <th>COLOR</th>
                    <th>
                        <div class="th-with-icon">

                            MODEL
                            <img src="../../../assets/chevron-selector-vertical.svg" alt="icon" width="14"
                                height="14" />
                        </div>
                    </th>
                    <th>
                        <div class="th-with-icon">

                            LAST UPDATE
                            <img src="../../../assets/chevron-selector-vertical.svg" alt="icon" width="14"
                                height="14" />
                        </div>
                    </th>
                    <th>STATE</th>
                    <th>DEVICES</th>
                    <th>SIM</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <UnitRow v-for="unit in units" :key="unit.id" :unit="unit" />
            </tbody>
        </table>
</template>


<style>


.units-table {
    background-color: #ffffff;
    width: 100%;
    margin-top: 20px;
    border: 1px solid #D7DEE4;
    padding: 0;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 12px;
    border-radius: 6px;
    overflow: hidden;

}

thead {
    background-color: #f0f5fa;
    color: #50606e
}

th,
td {
    padding: 12px;
    text-align: left;
}

.th-with-icon {
    display: flex;
    align-items: self-start;
    justify-content: center;
    gap: 2px;

}

.units-table td {
    border-bottom: 1px solid #ddd;

}
</style>