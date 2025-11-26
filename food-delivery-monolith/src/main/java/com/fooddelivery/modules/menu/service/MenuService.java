package com.fooddelivery.modules.menu.service;

import com.fooddelivery.modules.menu.entity.MenuItem;
import com.fooddelivery.modules.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public Optional<MenuItem> getMenuItem(Long id) {
        return menuItemRepository.findById(id);
    }

    public List<MenuItem> getMenuItems(List<Long> ids) {
        return menuItemRepository.findAllById(ids);
    }
}
