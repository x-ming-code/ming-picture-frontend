<template>
  <div id="homePage">

    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search
          placeholder="从海量图片中搜索"
          v-model:value="searchParams.searchText"
          enter-button="搜索"
          size="large"
          @search="doSearch"
      />
    </div>
    <!-- 分类 + 标签 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部"/>
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category"/>
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
            v-for="(tag, index) in tagList"
            :key="tag"
            v-model:checked="selectedTagList[index]"
            @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <!-- 图片列表 -->
    <!--    <a-list
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 7 }"
            :data-source="dataList"
            :pagination="pagination"
            :loading="loading"
        >
          <template #renderItem="{ item: picture }">
            <a-list-item style="padding: 0">
              &lt;!&ndash; 单张图片 &ndash;&gt;
              &lt;!&ndash; 单张图片 &ndash;&gt;
              <a-card hoverable @click="doClickPicture(picture)">

                <template #cover>
                  <img
                      style="height: 180px; object-fit: cover"
                      :alt="picture.name"
                      :src="picture.thumbnailUrl ?? picture.url"
                  />
                </template>
                <a-card-meta :title="picture.name">
                  <template #description>
                    <a-flex>
                      <a-tag color="green">
                        {{ picture.category ?? '默认' }}
                      </a-tag>
                      <a-tag v-for="tag in picture.tags" :key="tag">
                        {{ tag }}
                      </a-tag>
                    </a-flex>
                  </template>
                </a-card-meta>
              </a-card>
            </a-list-item>

          </template>
        </a-list>-->
    <!-- 图片列表 -->
<!--    <PictureList :dataList="dataList" :loading="loading" />-->
    <PictureList :dataList="dataList" :loading="loading" :showOp="true" />

    <!-- 分页 -->
    <a-pagination
        style="text-align: right"
        v-model:current="searchParams.current"
        v-model:pageSize="searchParams.pageSize"
        :total="total"
        @change="onPageChange"
    />


  </div>
</template>

<script setup lang="ts">
// 数据
import {listPictureTagCategoryUsingGet, listPictureVoByPageUsingPost} from "@/api/pictureController.ts";
import {message} from "ant-design-vue";
import {computed, onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import PictureList from "@/components/PictureList.vue";


const doSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

const dataList = ref([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 20,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类标签失败，' + res.data.message)
  }
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

onMounted(() => {
  getTagCategoryOptions()
})


// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

</script>

<style scoped>
#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}

#homePage .tag-bar {

  margin-bottom: 16px;
}
</style>
