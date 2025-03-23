"use client";

import Header from "@/app/(components)/Header";
import { Gift, Ticket, Timer, TrendingUp } from "lucide-react";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { useState, useMemo } from "react";

const mockRewardsData = [
	{
		id: 1,
		category: "Electronics",
		discount: 15,
		validUntil: "2024-05-30",
		usageCount: 45,
		type: "Percentage",
	},
	{
		id: 2,
		category: "Clothing",
		discount: 20,
		validUntil: "2024-06-15",
		usageCount: 30,
		type: "Percentage",
	},
	{
		id: 3,
		category: "Food",
		discount: 10,
		validUntil: "2024-05-20",
		usageCount: 60,
		type: "Percentage",
	},
	{
		id: 4,
		category: "Books",
		discount: 25,
		validUntil: "2024-07-01",
		usageCount: 15,
		type: "Percentage",
	},
];

type RewardCard = {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
};

const Rewards = () => {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedType, setSelectedType] = useState("All");

	// Calculate summary statistics
	const summaryCards: RewardCard[] = [
		{
			title: "Active Coupons",
			value: mockRewardsData.length,
			icon: <Ticket className="w-6 h-6" />,
			color: "bg-blue-100 text-blue-800",
		},
		{
			title: "Total Usage",
			value: mockRewardsData.reduce((acc, curr) => acc + curr.usageCount, 0),
			icon: <TrendingUp className="w-6 h-6" />,
			color: "bg-green-100 text-green-800",
		},
		{
			title: "Avg. Discount",
			value: `${Math.round(
				mockRewardsData.reduce((acc, curr) => acc + curr.discount, 0) /
					mockRewardsData.length
			)}%`,
			icon: <Gift className="w-6 h-6" />,
			color: "bg-purple-100 text-purple-800",
		},
		{
			title: "Expiring Soon",
			value: mockRewardsData.filter(
				(reward) =>
					new Date(reward.validUntil).getTime() - new Date().getTime() <
					7 * 24 * 60 * 60 * 1000
			).length,
			icon: <Timer className="w-6 h-6" />,
			color: "bg-red-100 text-red-800",
		},
	];

	// Prepare data for pie chart
	const pieChartData = useMemo(() => {
		return mockRewardsData.map((reward) => ({
			name: reward.category,
			value: reward.usageCount,
			color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
		}));
	}, []);

	const filteredRewards = useMemo(() => {
		return mockRewardsData.filter((reward) => {
			const matchesCategory =
				selectedCategory === "All" || reward.category === selectedCategory;
			const matchesType =
				selectedType === "All" || reward.type === selectedType;
			return matchesCategory && matchesType;
		});
	}, [selectedCategory, selectedType]);

	return (
		<div className="space-y-6">
			{/* HEADER */}
			<div>
				<Header name="Rewards & Coupons" />
				<p className="text-sm text-gray-500">
					Manage and track your product rewards and coupons
				</p>
			</div>

			{/* SUMMARY CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{summaryCards.map((card, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="bg-white rounded-lg shadow p-6 flex items-center space-x-4"
					>
						<div className={`${card.color} p-3 rounded-full`}>{card.icon}</div>
						<div>
							<p className="text-sm text-gray-500">{card.title}</p>
							<p className="text-2xl font-semibold">{card.value}</p>
						</div>
					</div>
				))}
			</div>

			{/* MAIN CONTENT */}
			<div className="flex flex-col lg:flex-row gap-6">
				{/* FILTERS */}
				<div className="w-full lg:w-1/3 bg-white shadow rounded-lg p-6">
					<h3 className="text-lg font-semibold mb-4">Filter Rewards</h3>
					<div className="space-y-4">
						<div>
							{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
							<label className="block text-sm font-medium text-gray-700">
								Category
							</label>
							<select
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
							>
								<option>All</option>
								<option>Electronics</option>
								<option>Clothing</option>
								<option>Food</option>
								<option>Books</option>
							</select>
						</div>
						<div>
							<label
								htmlFor="discount-type"
								className="block text-sm font-medium text-gray-700"
							>
								Discount Type
							</label>
							<select
								id="discount-type"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								value={selectedType}
								onChange={(e) => setSelectedType(e.target.value)}
							>
								<option>All</option>
								<option>Percentage</option>
								<option>Fixed</option>
							</select>
						</div>
					</div>
				</div>

				{/* CHART */}
				<div className="flex-grow bg-white shadow rounded-lg p-6">
					<h3 className="text-lg font-semibold mb-4">Usage Distribution</h3>
					<ResponsiveContainer width="100%" height={400}>
						<PieChart>
							<Pie
								data={pieChartData}
								cx="50%"
								cy="50%"
								label
								outerRadius={150}
								fill="#8884d8"
								dataKey="value"
							>
								{pieChartData.map((entry, index) => (
									<Cell key={`cell-${entry.name}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* REWARDS LIST */}
			<div className="bg-white shadow rounded-lg overflow-hidden">
				<div className="p-6">
					<h3 className="text-lg font-semibold mb-4">Active Rewards</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Category
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Discount
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Valid Until
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Usage Count
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredRewards.map((reward) => (
								<tr key={reward.id}>
									<td className="px-6 py-4 whitespace-nowrap">
										{reward.category}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{reward.discount}%
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{new Date(reward.validUntil).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{reward.usageCount}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Rewards;
