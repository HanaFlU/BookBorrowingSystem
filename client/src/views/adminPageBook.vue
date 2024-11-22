<template>
    <div>
        <BookList />
    </div>
</template>

<script>
import BookList from '@/components/AdminBookList.vue';

export default {
    name: 'AdminBooks',
    components: {
        BookList
    }
};
</script>
