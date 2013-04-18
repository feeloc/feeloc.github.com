---
layout: post
title: "排序算法总结"
date: 2012-08-03 20:56
comments: true
categories: 算法 javascript java
---
{% img http://feeloc.cn/downloads/images/1.jpg %}
>排序算法是经常会用的，但有天晚上突然想起，大学时候学了好多的排序算法，但后来大部分都忘记了，
>只记得了一堆的名字，决定去复习下各种排序算法。
<!-- more -->

##一、冒泡排序##
*	基本思想：就是像泡泡一样，从下往上冒，相邻两个数依次进行比较和调整
{% codeblock 冒泡排序-bubbleSort.java %}
public void bubbleSort() {
	int array[] = { 50, 21, 89, 30, 100, 22, 43, 11, 9, 19, 3 };
	int temp = 0;
	for (int i = 0; i < array.length - 1; i++) {
		for (int j = 0; j < array.length - i - 1; j++) {
			if (array[j] >= array[j + 1]) {
				temp = array[j];
				array[j] = array[j + 1];
				array[j + 1] = temp;
			}
		}
	}
	for (int a : array) {
		System.out.print(a + ",");
	}
}
{% endcodeblock %}

##二、快速排序##
*	基本思想：选择一个基准元素,通常选择第一个元素或者最后一个元素,通过一趟扫描，将待排序列分成两部分,一部分比基准元素小,一部分大于等于基准元素,此时基准元素在其排好序后的正确位置,然后再用同样的方法递归地排序划分的两部分。
{% codeblock 快速排序-QuickSort.java %}
public class QuickSort {
	int a[] = { 49, 38, 65, 97, 76, 13, 27, 49, 78, 34, 12, 64, 5, 4, 62, 99,
			98, 54, 56, 17, 18, 23, 34, 15, 35, 25, 53, 51 };

	public QuickSort() {
		quick(a);
		System.out.print("\n");
		for (int temp : a) {
			System.out.print(temp + ",");
		}
	}

	public int getMiddle(int[] list, int low, int high) {
		int tmp = list[low]; // 数组的第一个作为中轴
		while (low < high) {
			while (low < high && list[high] >= tmp) {
				high--;
			}
			list[low] = list[high]; // 比中轴小的记录移到低端
			while (low < high && list[low] <= tmp) {
				low++;
			}
			list[high] = list[low]; // 比中轴大的记录移到高端
		}
		list[low] = tmp; // 中轴记录到尾
		return low; // 返回中轴的位置
	}

	public void _quickSort(int[] list, int low, int high) {
		if (low < high) {
			int middle = getMiddle(list, low, high); // 将list数组进行一分为二
			_quickSort(list, low, middle - 1); // 对低字表进行递归排序
			_quickSort(list, middle + 1, high); // 对高字表进行递归排序
		}
	}

	public void quick(int[] a2) {
		if (a2.length > 0) { // 查看数组是否为空
			_quickSort(a2, 0, a2.length - 1);
		}
	}
}
{% endcodeblock%}

##三、归并排序##
*	基本排序：归并（Merge）排序法是将两个（或两个以上）有序表合并成一个新的有序表，即把待排序序列分为若干个子序列，每个子序列是有序的。然后再把有序子序列合并为整体有序序列。
{% codeblock MergingSort.java%}
import java.util.Arrays;

public class MergingSort {
	int a[] = { 49, 38, 65, 97, 76, 13, 27, 49, 78, 34, 12, 64, 5, 4, 62, 99,
			98, 54, 56, 17, 18, 23, 34, 15, 35, 25, 53, 51 };

	public MergingSort() {
		sort(a, 0, a.length - 1);
		System.out.println("\n");
		for (int i = 0; i < a.length; i++)
			System.out.print(a[i]+",");
	}

	public void sort(int[] data, int left, int right) {
		if (left < right) {
			// 找出中间索引
			int center = (left + right) / 2;
			// 对左边数组进行递归
			sort(data, left, center);
			// 对右边数组进行递归
			sort(data, center + 1, right);
			// 合并
			merge(data, left, center, right);

		}
	}

	public void merge(int[] data, int left, int center, int right) {
		int[] tmpArr = new int[data.length];
		int mid = center + 1;
		// third记录中间数组的索引
		int third = left;
		int tmp = left;
		while (left <= center && mid <= right) {

			// 从两个数组中取出最小的放入中间数组
			if (data[left] <= data[mid]) {
				tmpArr[third++] = data[left++];
			} else {
				tmpArr[third++] = data[mid++];
			}
		}
		// 剩余部分依次放入中间数组
		while (mid <= right) {
			tmpArr[third++] = data[mid++];
		}
		while (left <= center) {
			tmpArr[third++] = data[left++];
		}
		// 将中间数组中的内容复制回原数组
		while (tmp <= right) {
			data[tmp] = tmpArr[tmp++];
		}
	}
}
{% endcodeblock%}
