<template>
    <div class="dashboard">
        <div class="stats-card">
            <h3>Total Books</h3>
            <p>{{ totalBooks }}</p>
        </div>
        <div class="stats-card">
            <h3>Total Loans</h3>
            <p>{{ totalLoans }}</p>
        </div>
        <div class="stats-card">
            <h3>Total Users</h3>
            <p>{{ totalUsers }}</p>
        </div>
        <div class="stats-card">
            <h3>Overdue Books</h3>
            <p>{{ overdueBooks }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dashboard',
    data() {
        return {
            totalBooks: 1200,
            totalLoans: 350,
            totalUsers: 500,
            overdueBooks: 20
        };
    }
};
</script>

<style scoped>
.dashboard {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 20px;
}

.stats-card {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.stats-card h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.stats-card p {
    font-size: 24px;
    font-weight: bold;
    color: #4CAF50;
}
</style>
