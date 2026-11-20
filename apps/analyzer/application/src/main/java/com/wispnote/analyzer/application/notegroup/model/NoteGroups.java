package com.wispnote.analyzer.application.notegroup.model;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public record NoteGroups(List<NoteGroup> values) {

    public NoteGroups {
        values = List.copyOf(values);
    }

    public Optional<NoteGroup> findByIdOrTitle(UUID id, String title) {
        return findById(id).or(() -> findByTitle(title));
    }

    private Optional<NoteGroup> findById(UUID id) {
        return values.stream()
                .filter(group -> group.id().equals(id))
                .findFirst();
    }

    private Optional<NoteGroup> findByTitle(String title) {
        return values.stream()
                .filter(group -> group.title().equalsIgnoreCase(title))
                .findFirst();
    }
}
