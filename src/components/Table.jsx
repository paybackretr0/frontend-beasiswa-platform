import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Space, Dropdown } from "antd";
import { SearchOutlined, PlusOutlined, MoreOutlined } from "@ant-design/icons";

const { Search } = Input;

export const scholarshipData = [
  {
    key: 1,
    nama: "Beasiswa Unggulan UNAND",
    penyedia: "Universitas Andalas",
    status: "Aktif",
    batasWaktu: "2025-02-28",
  },
  {
    key: 2,
    nama: "Beasiswa KIP Kuliah",
    penyedia: "Kementerian Pendidikan",
    status: "Aktif",
    batasWaktu: "2025-03-15",
  },
  {
    key: 3,
    nama: "Beasiswa Bank Indonesia",
    penyedia: "Bank Indonesia",
    status: "Segera Berakhir",
    batasWaktu: "2025-01-20",
  },
  {
    key: 4,
    nama: "Beasiswa Djarum Foundation",
    penyedia: "Djarum Foundation",
    status: "Ditutup",
    batasWaktu: "2025-01-10",
  },
  {
    key: 5,
    nama: "Beasiswa Tanoto Foundation",
    penyedia: "Tanoto Foundation",
    status: "Aktif",
    batasWaktu: "2025-04-30",
  },
];

const UniversalTable = ({
  title,
  data,
  columns,
  rowKey = "key",
  searchFields = [],
  searchPlaceholder = "Cari data...",
  addButtonText = "Tambah Data",
  onAdd,
  pageSize = 10,
  scroll = { x: 800 },
  customFilters = null,
  onSearch = null,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (value) => {
    setSearchText(value);

    if (onSearch) {
      onSearch(value);
      return;
    }

    if (!value || searchFields.length === 0) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {(title || onAdd || searchFields.length > 0 || customFilters) && (
        <div className="p-6 pb-0">
          {(title || onAdd) && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              {onAdd && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={onAdd}
                  className="bg-[#2D60FF] border-[#2D60FF] hover:bg-[#1b3fa0]"
                >
                  {addButtonText}
                </Button>
              )}
            </div>
          )}

          {(searchFields.length > 0 || customFilters) && (
            <div className="flex gap-4 mb-4 items-center">
              {searchFields.length > 0 && (
                <div className="flex-1">
                  <Search
                    placeholder={searchPlaceholder}
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="middle"
                    onSearch={handleSearch}
                    onChange={(e) => {
                      if (!e.target.value) {
                        if (onSearch) {
                          onSearch("");
                        } else {
                          setFilteredData(data);
                          setSearchText("");
                        }
                      }
                    }}
                    style={{ maxWidth: 350 }}
                  />
                </div>
              )}

              {customFilters && (
                <div className="flex gap-3">{customFilters}</div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-6 pt-0">
        <Table
          columns={columns}
          dataSource={onSearch ? data : filteredData}
          rowKey={rowKey}
          pagination={{
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} dari ${total} data`,
          }}
          scroll={scroll}
        />
      </div>
    </div>
  );
};

export default UniversalTable;

export const createActionColumn = (actions) => ({
  title: "Aksi",
  key: "aksi",
  width: 80,
  render: (_, record) => {
    const visibleActions = actions.filter((action) => {
      if (typeof action.className === "function") {
        const className = action.className(record);
        return !className.includes("hidden");
      }
      return true;
    });

    if (visibleActions.length <= 2) {
      return (
        <Space>
          {visibleActions.map((action) => {
            const Icon =
              typeof action.icon === "function"
                ? action.icon(record)
                : action.icon;

            const danger =
              typeof action.danger === "function"
                ? action.danger(record)
                : action.danger;

            return (
              <Button
                key={action.key}
                size="small"
                icon={Icon}
                danger={danger}
                onClick={() => action.onClick?.(record)}
              >
                {action.label}
              </Button>
            );
          })}
        </Space>
      );
    }

    const menuItems = visibleActions.map((action) => ({
      key: action.key,
      label: action.label,
      icon:
        typeof action.icon === "function" ? action.icon(record) : action.icon,
      danger:
        typeof action.danger === "function"
          ? action.danger(record)
          : action.danger,
      onClick: () => action.onClick?.(record),
    }));

    return (
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          type="text"
          icon={<MoreOutlined />}
          className="hover:bg-gray-100"
        />
      </Dropdown>
    );
  },
});

export const createNumberColumn = () => ({
  title: "No",
  key: "number",
  width: 60,
  render: (_, __, index) => index + 1,
});

export const createStatusColumn = ({ Aktif, Nonaktif, mapValue }) => ({
  title: "Status",
  key: "status",
  render: (_, record) => {
    const value = mapValue ? mapValue(record) : record.status;
    const config = (value &&
      (Aktif && value === "Aktif" ? Aktif : Nonaktif)) || {
      color: "default",
    };
    return <Tag color={config.color}>{value}</Tag>;
  },
  filters: [
    { text: "Aktif", value: "Aktif" },
    { text: "Nonaktif", value: "Nonaktif" },
  ],
  onFilter: (value, record) =>
    (mapValue ? mapValue(record) : record.status) === value,
});
