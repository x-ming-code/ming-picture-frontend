<template>
  <div class="picture-list">
    <div class="masonry">
      <div v-for="picture in dataList" :key="picture.id" class="masonry-item">
        <a-card
            hoverable
            class="picture-card"
            @click="doClickPicture(picture)"
        >
          <template #cover>
            <a-image
                :src="picture.thumbnailUrl ?? picture.url"
                :alt="picture.name"
                style="width: 100%; height: auto; object-fit: cover"
                :preview="false"
            />
          </template>

          <a-card-meta :title="picture.name">
            <template #description>
              <a-flex wrap="wrap" gap="small">
                <a-tag color="green">{{ picture.category ?? '默认' }}</a-tag>
                <a-tag v-for="tag in picture.tags" :key="tag">{{ tag }}</a-tag>
              </a-flex>
            </template>
          </a-card-meta>

          <template v-if="showOp" #actions>
            <a-tooltip title="搜索">
              <search-outlined @click="(e) => doSearch(picture, e)"/>
            </a-tooltip>
            <a-tooltip title="分享">
              <share-alt-outlined @click="(e) => doShare(picture, e)"/>
            </a-tooltip>
            <a-tooltip title="编辑">
              <edit-outlined v-if="canEdit" @click="(e) => doEdit(picture, e)"/>
            </a-tooltip>
            <a-tooltip title="删除">
              <delete-outlined v-if="canDelete" @click="(e) => doDelete(picture, e)"/>
            </a-tooltip>
          </template>
        </a-card>
      </div>
    </div>

    <!-- 分享弹窗 -->
    <ShareModal ref="shareModalRef" :link="shareLink"/>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router"
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ShareAltOutlined
} from "@ant-design/icons-vue"
import {Modal, message} from "ant-design-vue"
import {ref} from "vue"
import ShareModal from "@/components/ShareModal.vue"
import {deletePictureUsingPost} from "@/api/pictureController"

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false
})

const router = useRouter()

const doClickPicture = (picture: API.PictureVO) => {
  const r = router.resolve({
    path: `/picture/${picture.id}`,
  })
  // 在新页面打开
  window.open(r.href, '_blank')
  //router.push({path: `/picture/${picture.id}`})
}

const doSearch = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  window.open(`/search_picture?pictureId=${picture.id}`)
}

const doEdit = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  router.push({
    path: "/add_picture",
    query: {
      id: picture.id,
      spaceId: picture.spaceId
    }
  })
}

const doDelete = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  Modal.confirm({
    title: "确认删除",
    content: "确定要删除这张图片吗？",
    okText: "确定",
    cancelText: "取消",
    onOk: async () => {
      try {
        const res = await deletePictureUsingPost({id: picture.id})
        if (res.data.code === 0) {
          message.success("删除成功")
          // 删除成功后刷新由父组件控制
        } else {
          message.error("删除失败")
        }
      } catch {
        message.error("删除请求失败")
      }
    }
  })
}

const shareModalRef = ref()
const shareLink = ref("")

const doShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.origin}/picture/${picture.id}`
  shareModalRef.value?.openModal()
}
</script>

<style scoped>
.picture-list {
  padding: 16px;
}

.masonry {
  column-count: 4;
  column-gap: 16px;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 16px;
}

.picture-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.picture-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
</style>
