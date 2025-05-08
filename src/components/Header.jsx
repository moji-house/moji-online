  <LinkComponent href="/route/profile/myprofile" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
    <div className="flex flex-col items-center">
      <FaUser className="text-xl" />
      <span className="text-xs">โปรไฟล์</span>
      <div className="text-xs text-yellow-600 font-medium hover:text-yellow-700">
        {userPoints[1] || 0} Coins
      </div>
    </div>
  </LinkComponent> 