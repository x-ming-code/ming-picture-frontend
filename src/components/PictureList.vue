<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                style="height: 180px; object-fit: cover"
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
<!--            <template v-if="showOp" #actions>-->
<!--              <search-outlined @click="(e) => doSearch(picture, e)" />-->
<!--              <share-alt-outlined @click="(e) => doShare(picture, e)" />-->
<!--              <edit-outlined @click="(e) => doEdit(picture, e)" />-->
<!--              <delete-outlined @click="(e) => doDelete(picture, e)" />-->
<!--            </template>-->

            <template v-if="showOp" #actions>
              <a-tooltip title="搜索">
                <search-outlined @click="(e) => doSearch(picture, e)" />
              </a-tooltip>
              <a-tooltip title="分享">
                <share-alt-outlined @click="(e) => doShare(picture, e)" />
              </a-tooltip>
              <a-tooltip title="编辑">
                <edit-outlined v-if="canEdit" @click="(e) => doEdit(picture, e)" />
              </a-tooltip>
              <a-tooltip title="删除">
                <delete-outlined v-if="canDelete" @click="(e) => doDelete(picture, e)" />
              </a-tooltip>
            </template>


          </a-card>
        </a-list-item>
      </template>

    </a-list>
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {DeleteOutlined, EditOutlined, SearchOutlined,ShareAltOutlined} from '@ant-design/icons-vue'
import {deletePictureUsingPost} from "@/api/pictureController.ts";
import {message, Modal} from "ant-design-vue";
import ShareModal from "@/components/ShareModal.vue";
import {ref} from "vue";

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})


// 搜索
const doSearch = (picture, e) => {
  e.stopPropagation()
  window.open(`/search_picture?pictureId=${picture.id}`)
}

const router = useRouter()
// 跳转至图片详情页
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// 编辑
const doEdit = (picture, e) => {
  e.stopPropagation()
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 删除
const doDelete = (picture, e) => {
  e.stopPropagation();
  const id = picture.id;
  if (!id) {
    return;
  }

  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这张图片吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deletePictureUsingPost({id});
        if (res.data.code === 0) {
          message.success('删除成功');
          props?.onReload();
        } else {
          message.error('删除失败');
        }
      } catch (error) {
        message.error('删除请求失败');
      }
    },
  });
};

// 分享弹窗引用
const shareModalRef = ref()
// 分享链接
const shareLink = ref<string>()

// 分享
const doShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}


</script>

<style scoped></style>
