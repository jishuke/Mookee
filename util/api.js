/**
 * 定义的所有的api
 * 还有定义的一些固定的数据
 * @slodon
 */

export default {
	sld_help_list: AppSldWebView+'cwap_help_center.html',
	sld_help_cat: AppSldWebView+'cwap_help_cate.html',
	sld_help_detail: AppSldWebView+'cwap_help_info.html',
	sld_sign_login: AppSldWebView+'cwap_user_points.html',
	sld_vendor_instro: AppSldWebView+'cwap_shop_intro.html',
	sld_home_index_data:AppSldUrl + '/index.php?app=index',
	sld_login:AppSldWebView+'cwap_login.html',
	sld_complete_account:AppSldWebView+'cwap_complete_account.html',
	sld_bind_account:AppSldWebView+'cwap_bind_account.html',
	sld_mine_predeposit:AppSldWebView+'cwap_useryue.html',//我的余额
	sld_cart:AppSldWebView+'cwap_cart.html',//购物车
	sld_account_safe:AppSldWebView+'cwap_account_safe.html',
	sld_account_setting:AppSldWebView+'cwap_user_account.html',
	sld_add_address:AppSldWebView+'cwap_address.html',//新增地址
	sld_address_list:AppSldWebView+'cwap_address_list.html',//地址列表
	sld_edit_address:AppSldWebView+'cwap_address_edit.html',//编辑地址
	sld_evaluate_list:AppSldWebView+'cwap_pro_eval_list.html',//评价列表
	sld_feedback:AppSldWebView+'cwap_feedback.html',//意见反馈
	sld_change_psd:AppSldWebView+'cwap_change_psd_login.html',//修改密码
	sld_forget_pwd:AppSldWebView+'cwap_forget_psd.html',//修改密码
	sld_get_voucher:AppSldWebView+'red_get_list.html',//优惠券列表
	sld_goods_detail_body:AppSldWebView+'cwap_product_info.html',//商品详情页
	sld_message:AppSldWebView+'cwap_user_msg.html',//商品详情页
	sld_message_detail:AppSldWebView+'cwap_user_msg_info.html',//商品详情页
	sld_my_voucher:AppSldWebView+'red_list.html',//我的优惠券
	sld_order_detail:AppSldWebView+'cwap_order_detail.html',//订单详情
	sld_vendor:AppSldWebView+'cwap_go_shop.html',//店铺
	sld_view_express:AppSldWebView+'cwap_order_delivery.html',//查看物流
	sld_return_send:AppSldWebView+'cwap_user_refund_send.html',//退货后的发货
	sld_return_detail:AppSldWebView+'cwap_user_refund_info.html',//退款退货详情
	sld_points_log:AppSldWebView+'cwap_pointslog_list.html',//积分明细
	sld_order_refund:AppSldWebView+'cwap_refund_all.html',//订单退款
	sld_order_list:AppSldWebView+'cwap_order_list.html',//订单列表
	sld_goods_rerutn:AppSldWebView+'cwap_return.html',//商品退货
	sld_order_goods_refund:AppSldWebView+'cwap_refund.html',//订单商品退款
	sld_goods_eva:AppSldWebView+'cwap_user_evaluation.html',//订单商品评价
	sld_ven_evaluation:AppSldWebView+'cwap_user_evaluation_shop.html',//订单店铺评价
	sld_team_detail:AppSldWebView+'cwap_user_evaluation_shop.html',//团队列表
	sld_register:AppSldWebView+'cwap_register_tel.html',//用户注册
	sld_my_team:AppSldWebView+'cwap_dis_income.html',//我的团队
	sld_team_list:AppSldWebView+'cwap_grade_detail.html',//团队列表
	sld_fenxiao_income:AppSldWebView+'cwap_disincome_detail.html',//分销佣金明细
	sld_collect_ven:AppSldWebView+'cwap_favorites_ven.html',//店铺收藏
	sld_my_pintuan:AppSldWebView+'pin_list.html',//我的拼团订单列表
	sld_my_pintuan_detail:AppSldWebView+'pin_detail.html',//我的拼团订单详情
	sld_vendor_list:AppSldWebView+'cwap_shop_list.html',//店铺列表

	sld_chat_client_base:ChatSldDomain+'mobile/index/index_app',//获取聊天基本信息
	sld_chat_client_notice_services:ChatSldDomain+'admin/event/notice',//通知客服有会员上线
	sld_chat_client_paidui_num:ChatSldDomain+'admin/event/getwaitnum',//获取排队人数
	sld_chat_client_zhuanjie:ChatSldDomain+'admin/event/getchangekefu',//转接给别的客服
	sld_chat_client_history_lists:ChatSldDomain+'admin/event/chatdata',//获取聊天记录
	sld_chat_client_send_chat:ChatSldDomain+'admin/event/chat',//发送聊天
	sld_chat_client_upload_pic:ChatSldDomain+'admin/event/upload',//上传图片
	sld_chat_client_question_list:ChatSldDomain+'admin/event/getquestion',//获取常见问题列表
	sld_chat_client_send_question:ChatSldDomain+'admin/event/getanswer',//发送常见问题
}
